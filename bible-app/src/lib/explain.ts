import type { LangKey } from "../data/languages";
import type { ChapterExplain } from "../data/explain";

interface ExplainFile {
  id: string;
  chapters: (ChapterExplain | null)[];
}

const memCache = new Map<string, Promise<ExplainFile>>();

// KJV and WEB share the same commentary, same as lib/insights.ts. zh-hans
// is reserved for real DeepSeek-generated content rather than an OpenCC
// conversion of the zh-hant file — the whole point of this second track is
// a distinct AI voice, not a mechanical translation of the first one.
function explainLang(lang: LangKey): "en" | "zh-hant" | "zh-hans" {
  return lang === "web" ? "en" : lang;
}

function loadExplainFile(bookId: string, lang: LangKey): Promise<ExplainFile> {
  const elang = explainLang(lang);
  const key = `${elang}-${bookId}`;
  let p = memCache.get(key);
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}explain/${elang}/${bookId}.json`).then((res) => {
      if (!res.ok) throw new Error(`Failed to load ${key}: ${res.status}`);
      return res.json() as Promise<ExplainFile>;
    });
    memCache.set(key, p);
    p.catch(() => memCache.delete(key));
  }
  return p;
}

// Not every chapter (or language) is covered yet, so this resolves to null
// rather than throwing — the UI simply omits the section for that chapter.
export async function loadChapterExplain(bookId: string, chapter: number, lang: LangKey): Promise<ChapterExplain | null> {
  try {
    const book = await loadExplainFile(bookId, lang);
    return book.chapters[chapter - 1] ?? null;
  } catch {
    return null;
  }
}
