import type { LangKey } from "../data/languages";
import type { Verse } from "../data/genesis1";

interface BookFile {
  id: string;
  chapters: Verse[][];
}

const memCache = new Map<string, Promise<BookFile>>();

// Bundled per-book JSON (public/bible/<lang>/<bookId>.json) is fetched lazily
// — only the book currently being read — and kept in memory for the session.
// The service worker's runtime-caching rule (see vite.config.ts) persists it
// to disk after that, so re-opening a book later doesn't re-download it, but
// nothing is ever pre-downloaded for books that haven't been opened.
function loadBookFile(bookId: string, lang: LangKey): Promise<BookFile> {
  const key = `${lang}-${bookId}`;
  let p = memCache.get(key);
  if (!p) {
    p = fetch(`/bible/${lang}/${bookId}.json`).then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${key}: ${res.status}`);
      return res.json() as Promise<BookFile>;
    });
    memCache.set(key, p);
    p.catch(() => memCache.delete(key));
  }
  return p;
}

export async function loadChapterVerses(bookId: string, chapter: number, lang: LangKey): Promise<Verse[]> {
  const book = await loadBookFile(bookId, lang);
  return book.chapters[chapter - 1] ?? [];
}
