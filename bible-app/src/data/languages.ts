export type LangKey = "en" | "web" | "zh-hant" | "zh-hans";

export const LANGUAGES: { key: LangKey; label: string; speechLang: string }[] = [
  { key: "en", label: "KJV", speechLang: "en-US" },
  { key: "web", label: "WEB", speechLang: "en-US" },
  { key: "zh-hant", label: "繁體", speechLang: "zh-TW" },
  { key: "zh-hans", label: "简体", speechLang: "zh-CN" },
];

export interface UiStrings {
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
  aboutLabel: string;
  versionLabel: string;
  listenLabel: string;
  stopLabel: string;
  ttsUnavailable: string;
  loadingLabel: string;
  mapLabel: string;
  mapEnglishSection: string;
  mapChineseSection: string;
  offlineStatusLabel: string;
  offlinePreparingTpl: string;
  offlineReadyLabel: string;
  offlineReadyToast: string;
  prevChapterLabel: string;
  nextChapterLabel: string;
}

export const UI: Record<LangKey, UiStrings> = {
  en: {
    chapterEyebrow: "{book} · Chapter {c}",
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
    aboutLabel: "About",
    versionLabel: "Version",
    listenLabel: "Listen",
    stopLabel: "Stop",
    ttsUnavailable: "Voice isn't available on this device/browser.",
    loadingLabel: "Loading…",
    mapLabel: "Map",
    mapEnglishSection: "English",
    mapChineseSection: "Chinese (Traditional / Simplified)",
    offlineStatusLabel: "Offline copy",
    offlinePreparingTpl: "Downloading… {n} / {total} — keep this open on wifi",
    offlineReadyLabel: "Ready — works with no connection",
    offlineReadyToast: "Offline copy ready — you can go offline now.",
    prevChapterLabel: "Previous",
    nextChapterLabel: "Next",
  },
  web: {
    chapterEyebrow: "{book} · Chapter {c}",
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
    aboutLabel: "About",
    versionLabel: "Version",
    listenLabel: "Listen",
    stopLabel: "Stop",
    ttsUnavailable: "Voice isn't available on this device/browser.",
    loadingLabel: "Loading…",
    mapLabel: "Map",
    mapEnglishSection: "English",
    mapChineseSection: "Chinese (Traditional / Simplified)",
    offlineStatusLabel: "Offline copy",
    offlinePreparingTpl: "Downloading… {n} / {total} — keep this open on wifi",
    offlineReadyLabel: "Ready — works with no connection",
    offlineReadyToast: "Offline copy ready — you can go offline now.",
    prevChapterLabel: "Previous",
    nextChapterLabel: "Next",
  },
  "zh-hant": {
    chapterEyebrow: "{book} · 第 {c} 章",
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
    aboutLabel: "關於",
    versionLabel: "版本",
    listenLabel: "朗讀",
    stopLabel: "停止",
    ttsUnavailable: "此裝置或瀏覽器無法使用語音功能。",
    loadingLabel: "載入中……",
    mapLabel: "地圖",
    mapEnglishSection: "英文",
    mapChineseSection: "中文（繁體／簡體）",
    offlineStatusLabel: "離線副本",
    offlinePreparingTpl: "下載中…… {n} / {total}——請保持開啟並連線 Wi-Fi",
    offlineReadyLabel: "已就緒——無需連線即可使用",
    offlineReadyToast: "離線內容已下載完成，現在可以離線使用了。",
    prevChapterLabel: "上一章",
    nextChapterLabel: "下一章",
  },
  "zh-hans": {
    chapterEyebrow: "{book} · 第 {c} 章",
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
    aboutLabel: "关于",
    versionLabel: "版本",
    listenLabel: "朗读",
    stopLabel: "停止",
    ttsUnavailable: "此设备或浏览器无法使用语音功能。",
    loadingLabel: "载入中……",
    mapLabel: "地图",
    mapEnglishSection: "英文",
    mapChineseSection: "中文（繁体／简体）",
    offlineStatusLabel: "离线副本",
    offlinePreparingTpl: "下载中…… {n} / {total}——请保持开启并连接 Wi-Fi",
    offlineReadyLabel: "已就绪——无需联网即可使用",
    offlineReadyToast: "离线内容已下载完成，现在可以离线使用了。",
    prevChapterLabel: "上一章",
    nextChapterLabel: "下一章",
  },
};

export function fmt(tpl: string, vals: Record<string, string | number>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => String(vals[k] ?? ""));
}
