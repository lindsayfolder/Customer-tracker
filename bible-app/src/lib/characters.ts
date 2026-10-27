import type { LangKey } from "../data/languages";

export interface CharacterBio {
  id: string;
  name: string;
  aliases: string[];
  bio: string;
}

interface AppearanceFile {
  id: string;
  chapters: Record<string, string[]>;
}

const appearanceCache = new Map<string, Promise<AppearanceFile | null>>();
const bioCache = new Map<string, Promise<CharacterBio | null>>();

// Mirrors lib/insights.ts / lib/explain.ts: KJV and WEB share the same
// (English) character content, so both read from the "en" file.
function charactersLang(lang: LangKey): "en" | "zh-hant" | "zh-hans" {
  return lang === "web" ? "en" : lang;
}

function loadAppearanceFile(bookId: string): Promise<AppearanceFile | null> {
  let p = appearanceCache.get(bookId);
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}characters/appearances/${bookId}.json`)
      .then((res) => (res.ok ? (res.json() as Promise<AppearanceFile>) : null))
      .catch(() => null);
    appearanceCache.set(bookId, p);
    p.then((v) => {
      if (v === null) appearanceCache.delete(bookId);
    });
  }
  return p;
}

function loadCharacterBio(id: string, lang: LangKey): Promise<CharacterBio | null> {
  const clang = charactersLang(lang);
  const key = `${clang}-${id}`;
  let p = bioCache.get(key);
  if (!p) {
    p = fetch(`${import.meta.env.BASE_URL}characters/${clang}/${id}.json`)
      .then((res) => (res.ok ? (res.json() as Promise<CharacterBio>) : null))
      .catch(() => null);
    bioCache.set(key, p);
    p.then((v) => {
      if (v === null) bioCache.delete(key);
    });
  }
  return p;
}

// Not every book has an appearance manifest yet, and a listed id might not
// have a bio file in every language — both quietly drop out of the list
// rather than breaking the chip row for chapters/books that aren't covered.
export async function loadChapterCharacters(bookId: string, chapter: number, lang: LangKey): Promise<CharacterBio[]> {
  const file = await loadAppearanceFile(bookId);
  const ids = file?.chapters[String(chapter)];
  if (!ids || ids.length === 0) return [];
  const bios = await Promise.all(ids.map((id) => loadCharacterBio(id, lang)));
  return bios.filter((b): b is CharacterBio => b !== null);
}
