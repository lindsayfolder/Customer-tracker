import type { LangKey } from "../data/languages";

export interface AppSettings {
  id: "app";
  fontScale: number;
  theme: "light" | "dark" | "auto";
  lastLang: LangKey;
  // Chosen SpeechSynthesisVoice.voiceURI per language, when the reader has
  // picked one in Settings — see lib/tts.ts. Unset means "let the browser
  // pick automatically."
  voiceByLang: Partial<Record<LangKey, string>>;
}

const STORAGE_KEY = "inkverse-settings";

export const DEFAULT_SETTINGS: AppSettings = {
  id: "app",
  fontScale: 1,
  theme: "auto",
  lastLang: "en",
  voiceByLang: {},
};

// localStorage, not IndexedDB: writes are synchronous and commit
// immediately, unlike an IndexedDB transaction which resolves on a later
// microtask/event-loop turn. On an installed ("Add to Home Screen") iOS
// app, backgrounding or closing the app can kill its process before an
// in-flight IndexedDB write reaches disk, silently dropping settings
// changes like font size — a reader would see them "not stick" every
// time. localStorage's synchronous write has no such window.
export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage full or unavailable (e.g. private browsing) — settings
    // simply won't persist this session, nothing else to do about it.
  }
}
