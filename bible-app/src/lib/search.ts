import type { LangKey } from "../data/languages";

// One version's worth of scripture, flattened for search: bookId -> chapters
// -> verse text (verse number is the array index + 1). Mirrors the shape of
// scripts/build-search-index.mjs's output.
type SearchIndex = Record<string, string[][]>;

const memCache = new Map<LangKey, Promise<SearchIndex>>();

// Same lazy-fetch-then-memoize approach as lib/scripture.ts's loadBookFile —
// only fetched the first time Search actually needs a given version, and
// persisted offline after that by the service worker's runtime-caching rule
// (see vite.config.ts).
function loadSearchIndex(lang: LangKey): Promise<SearchIndex> {
  let p = memCache.get(lang);
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}search-index/${lang}.json`).then((res) => {
      if (!res.ok) throw new Error(`Failed to load search index for ${lang}: ${res.status}`);
      return res.json() as Promise<SearchIndex>;
    });
    memCache.set(lang, p);
    p.catch(() => memCache.delete(lang));
  }
  return p;
}

export interface SearchHit {
  lang: LangKey;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
}

// Results are capped so a very common word (e.g. "the" or "神") can't force
// scanning and rendering tens of thousands of matches — this is a devotional
// reader, not a concordance tool. Scanning stops as soon as the cap is hit.
const MAX_HITS = 150;

export async function searchScripture(
  query: string,
  langs: LangKey[],
  bookIds: string[] | null // null = every book (no OT/NT restriction)
): Promise<SearchHit[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const indexes = await Promise.all(langs.map((lang) => loadSearchIndex(lang).then((idx) => [lang, idx] as const)));

  const hits: SearchHit[] = [];
  outer: for (const [lang, index] of indexes) {
    const ids = bookIds ?? Object.keys(index);
    for (const bookId of ids) {
      const chapters = index[bookId];
      if (!chapters) continue;
      for (let ci = 0; ci < chapters.length; ci++) {
        const verses = chapters[ci];
        for (let vi = 0; vi < verses.length; vi++) {
          const text = verses[vi];
          if (text.toLowerCase().includes(q)) {
            hits.push({ lang, bookId, chapter: ci + 1, verse: vi + 1, text });
            if (hits.length >= MAX_HITS) break outer;
          }
        }
      }
    }
  }
  return hits;
}
