import type { LangKey } from "../data/languages";
import type { Point } from "../data/genesis1";

interface InsightsFile {
  id: string;
  chapters: Point[][];
}

const memCache = new Map<string, Promise<InsightsFile>>();

// KJV and WEB share the same commentary (it's about the text's meaning, not
// its translation), so both read from the "en" file. zh-hans has its own
// file (derived from zh-hant via OpenCC, same as the scripture text).
function insightsLang(lang: LangKey): "en" | "zh-hant" | "zh-hans" {
  return lang === "web" ? "en" : lang;
}

function loadInsightsFile(bookId: string, lang: LangKey): Promise<InsightsFile> {
  const ilang = insightsLang(lang);
  const key = `${ilang}-${bookId}`;
  let p = memCache.get(key);
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}insights/${ilang}/${bookId}.json`).then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${key}: ${res.status}`);
      return res.json() as Promise<InsightsFile>;
    });
    memCache.set(key, p);
    p.catch(() => memCache.delete(key));
  }
  return p;
}

// Pre-generated 5-point deep dives, bundled the same way scripture text is —
// fetched lazily per book and cached by the service worker after that. Not
// every chapter has one yet (see scripts/ for the generation pipeline), so
// this resolves to null rather than throwing when a chapter isn't covered.
export async function loadChapterPoints(bookId: string, chapter: number, lang: LangKey): Promise<Point[] | null> {
  try {
    const book = await loadInsightsFile(bookId, lang);
    return book.chapters[chapter - 1] ?? null;
  } catch {
    return null;
  }
}
