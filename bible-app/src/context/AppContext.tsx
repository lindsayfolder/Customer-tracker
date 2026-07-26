import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { LangKey } from "../data/languages";
import { DEFAULT_SETTINGS, getCacheUsageMB, loadSettings, saveSettings, type AppSettings } from "../lib/db";

interface AppContextValue {
  lang: LangKey;
  setLang: (l: LangKey) => void;
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  cacheUsageMB: number;
  refreshCacheUsage: () => void;
  toast: (msg: string) => void;
  toastMsg: string | null;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangKey>("en");
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [cacheUsageMB, setCacheUsageMB] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setLangState(s.lastLang);
      setReady(true);
    });
    getCacheUsageMB().then(setCacheUsageMB);
  }, []);

  const setLang = useCallback(
    (l: LangKey) => {
      setLangState(l);
      const next = { ...settings, lastLang: l };
      setSettings(next);
      if (ready) saveSettings(next);
    },
    [settings, ready],
  );

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      const next = { ...settings, ...patch };
      setSettings(next);
      if (ready) saveSettings(next);
    },
    [settings, ready],
  );

  const refreshCacheUsage = useCallback(() => {
    getCacheUsageMB().then(setCacheUsageMB);
  }, []);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2200);
  }, []);

  return (
    <AppContext.Provider value={{ lang, setLang, settings, updateSettings, cacheUsageMB, refreshCacheUsage, toast, toastMsg }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
