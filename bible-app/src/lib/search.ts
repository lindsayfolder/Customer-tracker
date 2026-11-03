import type { LangKey } from "../data/languages";
import { BOOKS } from "../data/books";

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

type LoadedIndex = readonly [LangKey, SearchIndex];

// Book-outer, language-inner (rather than the reverse) so results come back
// grouped by canonical Bible order with every active language's matches for
// a book together — both so results read in reading order instead of
// scattered by version, and so the UI can build a single book-order jump
// rail from them (see SearchModal's results-rail).
function scanBooks(bookIds: string[], indexes: LoadedIndex[], q: string, cap: number): SearchHit[] {
  const hits: SearchHit[] = [];
  outer: for (const bookId of bookIds) {
    for (const [lang, index] of indexes) {
      const chapters = index[bookId];
      if (!chapters) continue;
      for (let ci = 0; ci < chapters.length; ci++) {
        const verses = chapters[ci];
        for (let vi = 0; vi < verses.length; vi++) {
          const text = verses[vi];
          if (text.toLowerCase().includes(q)) {
            hits.push({ lang, bookId, chapter: ci + 1, verse: vi + 1, text });
            if (hits.length >= cap) break outer;
          }
        }
      }
    }
  }
  return hits;
}

export async function searchScripture(
  query: string,
  langs: LangKey[],
  bookIds: string[] | null // null = every book (no OT/NT restriction)
): Promise<SearchHit[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const indexes = await Promise.all(langs.map((lang) => loadSearchIndex(lang).then((idx) => [lang, idx] as const)));

  if (bookIds) return scanBooks(bookIds, indexes, q, MAX_HITS);

  // Whole-Bible search: books are scanned in canonical order, Old Testament
  // first, so a word common enough in the OT's 39 books (e.g. "love") can
  // fill the entire cap before the scan ever reaches the New Testament —
  // "All" would then silently show only OT hits. Scanning each testament
  // separately, each with its own share of the cap, guarantees both are
  // represented.
  const otIds = BOOKS.filter((b) => b.testament === "OT").map((b) => b.id);
  const ntIds = BOOKS.filter((b) => b.testament === "NT").map((b) => b.id);
  return [...scanBooks(otIds, indexes, q, MAX_HITS / 2), ...scanBooks(ntIds, indexes, q, MAX_HITS / 2)];
}
