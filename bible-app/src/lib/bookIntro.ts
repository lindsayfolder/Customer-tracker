import type { LangKey } from "../data/languages";
import type { BookIntro } from "../data/bookIntro";

type IntroFile = Record<string, BookIntro>;

const memCache = new Map<string, Promise<IntroFile>>();

// KJV and WEB share the same intro text, same as lib/explain.ts.
function introLang(lang: LangKey): "en" | "zh-hant" | "zh-hans" {
  return lang === "web" ? "en" : lang;
}

// One small combined file per language (66 short entries, well under 100KB
// total per language) rather than 66 per-book files — unlike scripture or
// the per-chapter explain track, there's no reason to fetch this piecemeal.
function loadIntroFile(lang: LangKey): Promise<IntroFile> {
  const ilang = introLang(lang);
  let p = memCache.get(ilang);
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}bookintro/${ilang}.json`).then((res) => {
      if (!res.ok) throw new Error(`Failed to load book intro ${ilang}: ${res.status}`);
      return res.json() as Promise<IntroFile>;
    });
    memCache.set(ilang, p);
    p.catch(() => memCache.delete(ilang));
  }
  return p;
}

// Not every book is covered yet, so this resolves to null rather than
// throwing — the UI simply hides the Intro button for that book.
export async function loadBookIntro(bookId: string, lang: LangKey): Promise<BookIntro | null> {
  try {
    const file = await loadIntroFile(lang);
    return file[bookId] ?? null;
  } catch {
    return null;
  }
}
