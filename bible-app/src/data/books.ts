import type { LangKey } from "./languages";

export interface BookMeta {
  id: string;
  chapters: number;
  testament: "OT" | "NT";
  label: Record<LangKey, string>;
}

// Full 66-book Protestant canon. Text sourced from public-domain KJV, WEB,
// and CUV (Chinese Union Version, Traditional + Simplified) — see
// public/bible/<version>/<id>.json, fetched lazily per book on first open
// and cached by the service worker after that (never all precached).
export const BOOKS: BookMeta[] = [
  { id: "gen", chapters: 50, testament: "OT", label: { en: "Genesis", web: "Genesis", "zh-hant": "創世記", "zh-hans": "创世记" } },
  { id: "exo", chapters: 40, testament: "OT", label: { en: "Exodus", web: "Exodus", "zh-hant": "出埃及記", "zh-hans": "出埃及记" } },
  { id: "lev", chapters: 27, testament: "OT", label: { en: "Leviticus", web: "Leviticus", "zh-hant": "利未記", "zh-hans": "利未记" } },
  { id: "num", chapters: 36, testament: "OT", label: { en: "Numbers", web: "Numbers", "zh-hant": "民數記", "zh-hans": "民数记" } },
  { id: "deu", chapters: 34, testament: "OT", label: { en: "Deuteronomy", web: "Deuteronomy", "zh-hant": "申命記", "zh-hans": "申命记" } },
  { id: "jos", chapters: 24, testament: "OT", label: { en: "Joshua", web: "Joshua", "zh-hant": "約書亞記", "zh-hans": "约书亚记" } },
  { id: "jdg", chapters: 21, testament: "OT", label: { en: "Judges", web: "Judges", "zh-hant": "士師記", "zh-hans": "士师记" } },
  { id: "rut", chapters: 4, testament: "OT", label: { en: "Ruth", web: "Ruth", "zh-hant": "路得記", "zh-hans": "路得记" } },
  { id: "1sa", chapters: 31, testament: "OT", label: { en: "1 Samuel", web: "1 Samuel", "zh-hant": "撒母耳記上", "zh-hans": "撒母耳记上" } },
  { id: "2sa", chapters: 24, testament: "OT", label: { en: "2 Samuel", web: "2 Samuel", "zh-hant": "撒母耳記下", "zh-hans": "撒母耳记下" } },
  { id: "1ki", chapters: 22, testament: "OT", label: { en: "1 Kings", web: "1 Kings", "zh-hant": "列王紀上", "zh-hans": "列王纪上" } },
  { id: "2ki", chapters: 25, testament: "OT", label: { en: "2 Kings", web: "2 Kings", "zh-hant": "列王紀下", "zh-hans": "列王纪下" } },
  { id: "1ch", chapters: 29, testament: "OT", label: { en: "1 Chronicles", web: "1 Chronicles", "zh-hant": "歷代志上", "zh-hans": "历代志上" } },
  { id: "2ch", chapters: 36, testament: "OT", label: { en: "2 Chronicles", web: "2 Chronicles", "zh-hant": "歷代志下", "zh-hans": "历代志下" } },
  { id: "ezr", chapters: 10, testament: "OT", label: { en: "Ezra", web: "Ezra", "zh-hant": "以斯拉記", "zh-hans": "以斯拉记" } },
  { id: "neh", chapters: 13, testament: "OT", label: { en: "Nehemiah", web: "Nehemiah", "zh-hant": "尼希米記", "zh-hans": "尼希米记" } },
  { id: "est", chapters: 10, testament: "OT", label: { en: "Esther", web: "Esther", "zh-hant": "以斯帖記", "zh-hans": "以斯帖记" } },
  { id: "job", chapters: 42, testament: "OT", label: { en: "Job", web: "Job", "zh-hant": "約伯記", "zh-hans": "约伯记" } },
  { id: "psa", chapters: 150, testament: "OT", label: { en: "Psalms", web: "Psalms", "zh-hant": "詩篇", "zh-hans": "诗篇" } },
  { id: "pro", chapters: 31, testament: "OT", label: { en: "Proverbs", web: "Proverbs", "zh-hant": "箴言", "zh-hans": "箴言" } },
  { id: "ecc", chapters: 12, testament: "OT", label: { en: "Ecclesiastes", web: "Ecclesiastes", "zh-hant": "傳道書", "zh-hans": "传道书" } },
  { id: "sos", chapters: 8, testament: "OT", label: { en: "Song of Solomon", web: "Song of Solomon", "zh-hant": "雅歌", "zh-hans": "雅歌" } },
  { id: "isa", chapters: 66, testament: "OT", label: { en: "Isaiah", web: "Isaiah", "zh-hant": "以賽亞書", "zh-hans": "以赛亚书" } },
  { id: "jer", chapters: 52, testament: "OT", label: { en: "Jeremiah", web: "Jeremiah", "zh-hant": "耶利米書", "zh-hans": "耶利米书" } },
  { id: "lam", chapters: 5, testament: "OT", label: { en: "Lamentations", web: "Lamentations", "zh-hant": "耶利米哀歌", "zh-hans": "耶利米哀歌" } },
  { id: "eze", chapters: 48, testament: "OT", label: { en: "Ezekiel", web: "Ezekiel", "zh-hant": "以西結書", "zh-hans": "以西结书" } },
  { id: "dan", chapters: 12, testament: "OT", label: { en: "Daniel", web: "Daniel", "zh-hant": "但以理書", "zh-hans": "但以理书" } },
  { id: "hos", chapters: 14, testament: "OT", label: { en: "Hosea", web: "Hosea", "zh-hant": "何西阿書", "zh-hans": "何西阿书" } },
  { id: "joe", chapters: 3, testament: "OT", label: { en: "Joel", web: "Joel", "zh-hant": "約珥書", "zh-hans": "约珥书" } },
  { id: "amo", chapters: 9, testament: "OT", label: { en: "Amos", web: "Amos", "zh-hant": "阿摩司書", "zh-hans": "阿摩司书" } },
  { id: "oba", chapters: 1, testament: "OT", label: { en: "Obadiah", web: "Obadiah", "zh-hant": "俄巴底亞書", "zh-hans": "俄巴底亚书" } },
  { id: "jon", chapters: 4, testament: "OT", label: { en: "Jonah", web: "Jonah", "zh-hant": "約拿書", "zh-hans": "约拿书" } },
  { id: "mic", chapters: 7, testament: "OT", label: { en: "Micah", web: "Micah", "zh-hant": "彌迦書", "zh-hans": "弥迦书" } },
  { id: "nah", chapters: 3, testament: "OT", label: { en: "Nahum", web: "Nahum", "zh-hant": "那鴻書", "zh-hans": "那鸿书" } },
  { id: "hab", chapters: 3, testament: "OT", label: { en: "Habakkuk", web: "Habakkuk", "zh-hant": "哈巴谷書", "zh-hans": "哈巴谷书" } },
  { id: "zep", chapters: 3, testament: "OT", label: { en: "Zephaniah", web: "Zephaniah", "zh-hant": "西番雅書", "zh-hans": "西番雅书" } },
  { id: "hag", chapters: 2, testament: "OT", label: { en: "Haggai", web: "Haggai", "zh-hant": "哈該書", "zh-hans": "哈该书" } },
  { id: "zec", chapters: 14, testament: "OT", label: { en: "Zechariah", web: "Zechariah", "zh-hant": "撒迦利亞書", "zh-hans": "撒迦利亚书" } },
  { id: "mal", chapters: 4, testament: "OT", label: { en: "Malachi", web: "Malachi", "zh-hant": "瑪拉基書", "zh-hans": "玛拉基书" } },
  { id: "mat", chapters: 28, testament: "NT", label: { en: "Matthew", web: "Matthew", "zh-hant": "馬太福音", "zh-hans": "马太福音" } },
  { id: "mar", chapters: 16, testament: "NT", label: { en: "Mark", web: "Mark", "zh-hant": "馬可福音", "zh-hans": "马可福音" } },
  { id: "luk", chapters: 24, testament: "NT", label: { en: "Luke", web: "Luke", "zh-hant": "路加福音", "zh-hans": "路加福音" } },
  { id: "joh", chapters: 21, testament: "NT", label: { en: "John", web: "John", "zh-hant": "約翰福音", "zh-hans": "约翰福音" } },
  { id: "act", chapters: 28, testament: "NT", label: { en: "Acts", web: "Acts", "zh-hant": "使徒行傳", "zh-hans": "使徒行传" } },
  { id: "rom", chapters: 16, testament: "NT", label: { en: "Romans", web: "Romans", "zh-hant": "羅馬書", "zh-hans": "罗马书" } },
  { id: "1co", chapters: 16, testament: "NT", label: { en: "1 Corinthians", web: "1 Corinthians", "zh-hant": "哥林多前書", "zh-hans": "哥林多前书" } },
  { id: "2co", chapters: 13, testament: "NT", label: { en: "2 Corinthians", web: "2 Corinthians", "zh-hant": "哥林多後書", "zh-hans": "哥林多后书" } },
  { id: "gal", chapters: 6, testament: "NT", label: { en: "Galatians", web: "Galatians", "zh-hant": "加拉太書", "zh-hans": "加拉太书" } },
  { id: "eph", chapters: 6, testament: "NT", label: { en: "Ephesians", web: "Ephesians", "zh-hant": "以弗所書", "zh-hans": "以弗所书" } },
  { id: "phi", chapters: 4, testament: "NT", label: { en: "Philippians", web: "Philippians", "zh-hant": "腓立比書", "zh-hans": "腓立比书" } },
  { id: "col", chapters: 4, testament: "NT", label: { en: "Colossians", web: "Colossians", "zh-hant": "歌羅西書", "zh-hans": "歌罗西书" } },
  { id: "1th", chapters: 5, testament: "NT", label: { en: "1 Thessalonians", web: "1 Thessalonians", "zh-hant": "帖撒羅尼迦前書", "zh-hans": "帖撒罗尼迦前书" } },
  { id: "2th", chapters: 3, testament: "NT", label: { en: "2 Thessalonians", web: "2 Thessalonians", "zh-hant": "帖撒羅尼迦後書", "zh-hans": "帖撒罗尼迦后书" } },
  { id: "1ti", chapters: 6, testament: "NT", label: { en: "1 Timothy", web: "1 Timothy", "zh-hant": "提摩太前書", "zh-hans": "提摩太前书" } },
  { id: "2ti", chapters: 4, testament: "NT", label: { en: "2 Timothy", web: "2 Timothy", "zh-hant": "提摩太後書", "zh-hans": "提摩太后书" } },
  { id: "tit", chapters: 3, testament: "NT", label: { en: "Titus", web: "Titus", "zh-hant": "提多書", "zh-hans": "提多书" } },
  { id: "phm", chapters: 1, testament: "NT", label: { en: "Philemon", web: "Philemon", "zh-hant": "腓利門書", "zh-hans": "腓利门书" } },
  { id: "heb", chapters: 13, testament: "NT", label: { en: "Hebrews", web: "Hebrews", "zh-hant": "希伯來書", "zh-hans": "希伯来书" } },
  { id: "jas", chapters: 5, testament: "NT", label: { en: "James", web: "James", "zh-hant": "雅各書", "zh-hans": "雅各书" } },
  { id: "1pe", chapters: 5, testament: "NT", label: { en: "1 Peter", web: "1 Peter", "zh-hant": "彼得前書", "zh-hans": "彼得前书" } },
  { id: "2pe", chapters: 3, testament: "NT", label: { en: "2 Peter", web: "2 Peter", "zh-hant": "彼得後書", "zh-hans": "彼得后书" } },
  { id: "1jo", chapters: 5, testament: "NT", label: { en: "1 John", web: "1 John", "zh-hant": "約翰一書", "zh-hans": "约翰一书" } },
  { id: "2jo", chapters: 1, testament: "NT", label: { en: "2 John", web: "2 John", "zh-hant": "約翰二書", "zh-hans": "约翰二书" } },
  { id: "3jo", chapters: 1, testament: "NT", label: { en: "3 John", web: "3 John", "zh-hant": "約翰三書", "zh-hans": "约翰三书" } },
  { id: "jud", chapters: 1, testament: "NT", label: { en: "Jude", web: "Jude", "zh-hant": "猶大書", "zh-hans": "犹大书" } },
  { id: "rev", chapters: 22, testament: "NT", label: { en: "Revelation", web: "Revelation", "zh-hant": "啟示錄", "zh-hans": "启示录" } },
];

export function bookAbbr(book: BookMeta, lang: LangKey): string {
  if (lang === "en" || lang === "web") return book.id.slice(0, 3).toUpperCase();
  return book.label[lang].slice(0, 1);
}
