import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "./styles/theme.css";
import App from "./App.tsx";
import { AppProvider } from "./context/AppContext";
import { registerUpdateHooks, setUpdateAvailable } from "./lib/appUpdate";
import { cleanupLegacyCaches } from "./lib/offlineStatus";

cleanupLegacyCaches();

// Detect new builds, but don't force a reload the moment one is found — a
// silent reload could yank a reader off whatever they're mid-read on.
// Instead, surface it as an "Update available" state the reader can act on
// from Settings (see lib/appUpdate.ts), and hand that module the live
// ServiceWorkerRegistration so a manual "Check for updates" tap can ask the
// browser to look for a new build on demand, not just wait for its own
// periodic check.
let updateSW: (reload?: boolean) => Promise<void>;
updateSW = registerSW({
  onNeedRefresh: () => setUpdateAvailable(),
  onRegisteredSW: (_url, registration) => registerUpdateHooks(updateSW, registration),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);
