import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { LangKey } from "../data/languages";
import { UI } from "../data/languages";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type AppSettings } from "../lib/db";
import { getCachedEntryCount, isReadyCount, EXPECTED_PRECACHE_ENTRIES } from "../lib/offlineStatus";

interface AppContextValue {
  lang: LangKey;
  setLang: (l: LangKey) => void;
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  toast: (msg: string) => void;
  toastMsg: string | null;
  offlineReady: boolean;
  offlineCount: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangKey>("en");
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [offlineCount, setOfflineCount] = useState(0);

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setLangState(s.lastLang);
      setReady(true);
    });
  }, []);

  // Polls actual Cache Storage — not just "is a service worker
  // registered" — since that can be true long before the one-time ~30MB
  // offline download finishes. Surfaces a real signal in Settings instead
  // of leaving the reader to guess whether it's safe to go offline yet.
  useEffect(() => {
    let cancelled = false;
    let firstCheckDone = false;
    let toastedThisSession = false;

    async function check() {
      const count = await getCachedEntryCount();
      if (cancelled) return;
      setOfflineCount(count);
      const nowReady = isReadyCount(count);
      if (nowReady && firstCheckDone && !toastedThisSession) {
        toastedThisSession = true;
        toast(UI[lang].offlineReadyToast);
      }
      firstCheckDone = true;
      setOfflineReady(nowReady);
    }

    check();
    const interval = window.setInterval(check, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2200);
  }, []);

  return (
    <AppContext.Provider
      value={{ lang, setLang, settings, updateSettings, toast, toastMsg, offlineReady, offlineCount }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export { EXPECTED_PRECACHE_ENTRIES };
