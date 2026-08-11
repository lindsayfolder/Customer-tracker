import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { LangKey } from "../data/languages";
import { UI } from "../data/languages";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type AppSettings } from "../lib/db";
import { isReadyCount } from "../lib/offlineStatus";
import { runBulkDownload, TOTAL_CONTENT_FILES } from "../lib/bulkOfflineDownload";

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

  // Downloads the offline content library in small resumable batches from
  // ordinary page code (see lib/bulkOfflineDownload.ts for why this isn't
  // done as one atomic service-worker install step). Surfaces real
  // progress in Settings instead of leaving the reader to guess whether
  // it's safe to go offline yet, and toasts once on the transition to
  // fully ready.
  useEffect(() => {
    let cancelled = false;
    let toastedThisSession = false;
    let sawNotReady = false;

    runBulkDownload((done, total) => {
      if (cancelled) return;
      setOfflineCount(done);
      const nowReady = isReadyCount(done, total);
      // Only announce the *transition* into ready — a returning reader
      // who was already fully cached from a previous visit shouldn't get
      // a "ready!" toast every time they simply open the app.
      if (!nowReady) sawNotReady = true;
      if (nowReady && sawNotReady && !toastedThisSession) {
        toastedThisSession = true;
        toast(UI[lang].offlineReadyToast);
      }
      setOfflineReady(nowReady);
    });

    return () => {
      cancelled = true;
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

export { TOTAL_CONTENT_FILES };
