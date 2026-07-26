import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "./styles/theme.css";
import App from "./App.tsx";
import { AppProvider } from "./context/AppContext";

// Force an immediate reload the moment a new build is detected, instead of
// silently waiting for a future navigation. Without this, a device could
// keep running an old service worker referencing hashed JS/CSS filenames
// from a previous deploy that no longer exist on the server, after several
// rapid redeploys — a stale, half-broken mix of old and new code.
let updateSW: (reload?: boolean) => Promise<void>;
updateSW = registerSW({ immediate: true, onNeedRefresh: () => updateSW(true) });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);
