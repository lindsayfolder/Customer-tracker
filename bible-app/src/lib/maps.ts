const BOOKS_WITH_MAPS = new Set([
  "gen", "exo", "num", "jos", "jdg", "rut", "1sa", "2sa", "1ki", "2ki",
  "ezr", "neh", "est", "dan", "jon",
  "mat", "mar", "luk", "joh", "act", "rev",
]);

export function bookHasMap(bookId: string): boolean {
  return BOOKS_WITH_MAPS.has(bookId);
}

const memCache = new Map<string, Promise<string>>();

// Book-level illustrative maps (public/maps/<bookId>.svg and the paired
// <bookId>-zh.svg, which carries the same map with Traditional + Simplified
// Chinese labels stacked per point), fetched lazily — only when a book that
// has one is opened — and cached in memory for the session. The service
// worker's runtime-caching rule (see vite.config.ts) persists it to disk
// after that. Raw SVG markup, not a per-chapter asset: one pair of files
// covers every chapter of that book, and both are shown together
// regardless of the app's current reading language, so switching between
// KJV/WEB/繁體/简體 never hides either map.
function loadMapFile(path: string): Promise<string> {
  let p = memCache.get(path);
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}maps/${path}.svg`).then((res) => {
      if (!res.ok) throw new Error(`Failed to load map ${path}: ${res.status}`);
      return res.text();
    });
    memCache.set(path, p);
    p.catch(() => memCache.delete(path));
  }
  return p;
}

export async function loadBookMap(bookId: string): Promise<string | null> {
  if (!bookHasMap(bookId)) return null;
  try {
    return await loadMapFile(bookId);
  } catch {
    return null;
  }
}

export async function loadBookMapZh(bookId: string): Promise<string | null> {
  if (!bookHasMap(bookId)) return null;
  try {
    return await loadMapFile(`${bookId}-zh`);
  } catch {
    return null;
  }
}
