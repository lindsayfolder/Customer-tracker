import type { LangKey } from "./languages";

export interface BookMeta {
  id: string;
  chapters: number;
  testament: "OT" | "NT";
  label: Record<LangKey, string>;
}

// A representative slice of the 66-book canon. Chapter counts are the real
// counts for each book; only Genesis chapter 1 has seed content bundled
// (see genesis1.ts) — everything else is generated on demand once an AI key
// is configured, per book/chapter/language, and cached in IndexedDB.
export const BOOKS: BookMeta[] = [
  { id: "gen", chapters: 50, testament: "OT", label: { en: "Genesis", web: "Genesis", "zh-hant": "創世記", "zh-hans": "创世记" } },
  { id: "exo", chapters: 40, testament: "OT", label: { en: "Exodus", web: "Exodus", "zh-hant": "出埃及記", "zh-hans": "出埃及记" } },
  { id: "psa", chapters: 150, testament: "OT", label: { en: "Psalms", web: "Psalms", "zh-hant": "詩篇", "zh-hans": "诗篇" } },
  { id: "pro", chapters: 31, testament: "OT", label: { en: "Proverbs", web: "Proverbs", "zh-hant": "箴言", "zh-hans": "箴言" } },
  { id: "isa", chapters: 66, testament: "OT", label: { en: "Isaiah", web: "Isaiah", "zh-hant": "以賽亞書", "zh-hans": "以赛亚书" } },
  { id: "mat", chapters: 28, testament: "NT", label: { en: "Matthew", web: "Matthew", "zh-hant": "馬太福音", "zh-hans": "马太福音" } },
  { id: "mar", chapters: 16, testament: "NT", label: { en: "Mark", web: "Mark", "zh-hant": "馬可福音", "zh-hans": "马可福音" } },
  { id: "luk", chapters: 24, testament: "NT", label: { en: "Luke", web: "Luke", "zh-hant": "路加福音", "zh-hans": "路加福音" } },
  { id: "joh", chapters: 21, testament: "NT", label: { en: "John", web: "John", "zh-hant": "約翰福音", "zh-hans": "约翰福音" } },
  { id: "rom", chapters: 16, testament: "NT", label: { en: "Romans", web: "Romans", "zh-hant": "羅馬書", "zh-hans": "罗马书" } },
  { id: "rev", chapters: 22, testament: "NT", label: { en: "Revelation", web: "Revelation", "zh-hant": "啟示錄", "zh-hans": "启示录" } },
];

export function bookAbbr(book: BookMeta, lang: LangKey): string {
  if (lang === "en" || lang === "web") return book.id.slice(0, 3).toUpperCase();
  return book.label[lang].slice(0, 1);
}
