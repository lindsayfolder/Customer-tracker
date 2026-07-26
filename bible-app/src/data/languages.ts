export type LangKey = "en" | "web" | "zh-hant" | "zh-hans";

export const LANGUAGES: { key: LangKey; label: string; speechLang: string }[] = [
  { key: "en", label: "KJV", speechLang: "en-US" },
  { key: "web", label: "WEB", speechLang: "en-US" },
  { key: "zh-hant", label: "繁體", speechLang: "zh-TW" },
  { key: "zh-hans", label: "简体", speechLang: "zh-CN" },
];

export interface UiStrings {
  storageChip: string;
  chapterEyebrow: string;
  tabScripture: string;
  tabInsights: string;
  sectionLeft: string;
  sectionRight: string;
  aiTag: string;
  backTab: string;
  scriptureNote: string;
  drawerHome: string;
  drawerContents: string;
  drawerSearch: string;
  drawerSettings: string;
  contentsTitle: string;
  contentsHint: string;
  searchTitle: string;
  searchPlaceholder: string;
  scopeAll: string;
  scopeOT: string;
  scopeNT: string;
  recentLabel: string;
  noResults: string;
  fontSizeLabel: string;
  themeLabel: string;
  themeLight: string;
  themeDark: string;
  themeAuto: string;
  aiCacheLabel: string;
  cacheUsedTpl: string;
  cacheCapTpl: string;
  keepFavLabel: string;
  cacheExplain: string;
  clearCacheBtn: string;
  clearedMsg: string;
  aboutLabel: string;
  versionLabel: string;
  sampleOnlyMsg: string;
  listenLabel: string;
  stopLabel: string;
  ttsUnavailable: string;
  generateBtn: string;
  generatingMsg: string;
  needsKeyMsg: string;
}

export const UI: Record<LangKey, UiStrings> = {
  en: {
    storageChip: "AI cache {n} MB",
    chapterEyebrow: "Genesis · Chapter {c}",
    tabScripture: "Scripture",
    tabInsights: "Insights",
    sectionLeft: "5 Main Points",
    sectionRight: "AI-drawn",
    aiTag: "AI deep dive",
    backTab: "Back to chapter",
    scriptureNote: "King James Version · public domain",
    drawerHome: "Home",
    drawerContents: "Contents",
    drawerSearch: "Search",
    drawerSettings: "Settings",
    contentsTitle: "Contents",
    contentsHint: "Tap a book, then a chapter.",
    searchTitle: "Search",
    searchPlaceholder: "Search verses & insights",
    scopeAll: "All",
    scopeOT: "OT",
    scopeNT: "NT",
    recentLabel: "Recent",
    noResults: "No matches yet — try “light” or “image”",
    fontSizeLabel: "Text size",
    themeLabel: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",
    themeAuto: "Auto",
    aiCacheLabel: "AI cache",
    cacheUsedTpl: "{n} MB used",
    cacheCapTpl: "Cap: {n}",
    keepFavLabel: "Never auto-clear favorites",
    cacheExplain: "Chapters you haven't reopened in a while are removed automatically to stay under the cap. Nothing is deleted while you're offline, and reopening a chapter regenerates it in seconds.",
    clearCacheBtn: "Clear AI cache now",
    clearedMsg: "Cleared — scripture stays, only AI insights were removed.",
    aboutLabel: "About",
    versionLabel: "Version",
    sampleOnlyMsg: "This chapter hasn't been read yet — connect an AI key in Settings to generate it, or come back once it's cached.",
    listenLabel: "Listen",
    stopLabel: "Stop",
    ttsUnavailable: "Voice isn't available on this device/browser.",
    generateBtn: "Generate 5 points with AI",
    generatingMsg: "Thinking through the chapter…",
    needsKeyMsg: "Add an AI key in Settings to generate new chapters.",
  },
  web: {
    storageChip: "AI cache {n} MB",
    chapterEyebrow: "Genesis · Chapter {c}",
    tabScripture: "Scripture",
    tabInsights: "Insights",
    sectionLeft: "5 Main Points",
    sectionRight: "AI-drawn",
    aiTag: "AI deep dive",
    backTab: "Back to chapter",
    scriptureNote: "World English Bible · public domain",
    drawerHome: "Home",
    drawerContents: "Contents",
    drawerSearch: "Search",
    drawerSettings: "Settings",
    contentsTitle: "Contents",
    contentsHint: "Tap a book, then a chapter.",
    searchTitle: "Search",
    searchPlaceholder: "Search verses & insights",
    scopeAll: "All",
    scopeOT: "OT",
    scopeNT: "NT",
    recentLabel: "Recent",
    noResults: "No matches yet — try “light” or “image”",
    fontSizeLabel: "Text size",
    themeLabel: "Appearance",
    themeLight: "Light",
    themeDark: "Dark",
    themeAuto: "Auto",
    aiCacheLabel: "AI cache",
    cacheUsedTpl: "{n} MB used",
    cacheCapTpl: "Cap: {n}",
    keepFavLabel: "Never auto-clear favorites",
    cacheExplain: "Chapters you haven't reopened in a while are removed automatically to stay under the cap. Nothing is deleted while you're offline, and reopening a chapter regenerates it in seconds.",
    clearCacheBtn: "Clear AI cache now",
    clearedMsg: "Cleared — scripture stays, only AI insights were removed.",
    aboutLabel: "About",
    versionLabel: "Version",
    sampleOnlyMsg: "This chapter hasn't been read yet — connect an AI key in Settings to generate it, or come back once it's cached.",
    listenLabel: "Listen",
    stopLabel: "Stop",
    ttsUnavailable: "Voice isn't available on this device/browser.",
    generateBtn: "Generate 5 points with AI",
    generatingMsg: "Thinking through the chapter…",
    needsKeyMsg: "Add an AI key in Settings to generate new chapters.",
  },
  "zh-hant": {
    storageChip: "AI 快取 {n} MB",
    chapterEyebrow: "創世記 · 第 {c} 章",
    tabScripture: "經文",
    tabInsights: "洞見",
    sectionLeft: "五個要點",
    sectionRight: "AI 生成",
    aiTag: "AI 深度解析",
    backTab: "返回本章",
    scriptureNote: "和合本 · 公有領域",
    drawerHome: "首頁",
    drawerContents: "目錄",
    drawerSearch: "搜尋",
    drawerSettings: "設定",
    contentsTitle: "目錄",
    contentsHint: "先選書卷，再選章節。",
    searchTitle: "搜尋",
    searchPlaceholder: "搜尋經文與要點",
    scopeAll: "全部",
    scopeOT: "舊約",
    scopeNT: "新約",
    recentLabel: "最近搜尋",
    noResults: "還沒有結果——試試「光」或「形像」",
    fontSizeLabel: "文字大小",
    themeLabel: "外觀",
    themeLight: "淺色",
    themeDark: "深色",
    themeAuto: "自動",
    aiCacheLabel: "AI 快取",
    cacheUsedTpl: "已使用 {n} MB",
    cacheCapTpl: "上限：{n}",
    keepFavLabel: "我的最愛永不自動清除",
    cacheExplain: "長時間沒有重新開啟的章節會自動移除，以維持在上限之內。離線時不會刪除任何內容，重新開啟章節只需幾秒即可重新生成。",
    clearCacheBtn: "立即清除 AI 快取",
    clearedMsg: "已清除——經文仍保留，只移除了 AI 要點內容。",
    aboutLabel: "關於",
    versionLabel: "版本",
    sampleOnlyMsg: "這一章還沒有生成過——請在設定中加入 AI 金鑰來生成，或等它被快取後再回來看看。",
    listenLabel: "朗讀",
    stopLabel: "停止",
    ttsUnavailable: "此裝置或瀏覽器無法使用語音功能。",
    generateBtn: "用 AI 生成五個要點",
    generatingMsg: "正在解讀這一章……",
    needsKeyMsg: "請在設定中加入 AI 金鑰以生成新的章節。",
  },
  "zh-hans": {
    storageChip: "AI 缓存 {n} MB",
    chapterEyebrow: "创世记 · 第 {c} 章",
    tabScripture: "经文",
    tabInsights: "洞见",
    sectionLeft: "五个要点",
    sectionRight: "AI 生成",
    aiTag: "AI 深度解析",
    backTab: "返回本章",
    scriptureNote: "和合本 · 公有领域",
    drawerHome: "首页",
    drawerContents: "目录",
    drawerSearch: "搜索",
    drawerSettings: "设置",
    contentsTitle: "目录",
    contentsHint: "先选书卷，再选章节。",
    searchTitle: "搜索",
    searchPlaceholder: "搜索经文与要点",
    scopeAll: "全部",
    scopeOT: "旧约",
    scopeNT: "新约",
    recentLabel: "最近搜索",
    noResults: "还没有结果——试试“光”或“形象”",
    fontSizeLabel: "文字大小",
    themeLabel: "外观",
    themeLight: "浅色",
    themeDark: "深色",
    themeAuto: "自动",
    aiCacheLabel: "AI 缓存",
    cacheUsedTpl: "已使用 {n} MB",
    cacheCapTpl: "上限：{n}",
    keepFavLabel: "我的收藏永不自动清除",
    cacheExplain: "长时间没有重新打开的章节会自动移除，以维持在上限之内。离线时不会删除任何内容，重新打开章节只需几秒即可重新生成。",
    clearCacheBtn: "立即清除 AI 缓存",
    clearedMsg: "已清除——经文仍保留，只移除了 AI 要点内容。",
    aboutLabel: "关于",
    versionLabel: "版本",
    sampleOnlyMsg: "这一章还没有生成过——请在设置中加入 AI 密钥来生成，或等它被缓存后再回来看看。",
    listenLabel: "朗读",
    stopLabel: "停止",
    ttsUnavailable: "此设备或浏览器无法使用语音功能。",
    generateBtn: "用 AI 生成五个要点",
    generatingMsg: "正在解读这一章……",
    needsKeyMsg: "请在设置中加入 AI 密钥以生成新的章节。",
  },
};

export function fmt(tpl: string, vals: Record<string, string | number>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => String(vals[k] ?? ""));
}
