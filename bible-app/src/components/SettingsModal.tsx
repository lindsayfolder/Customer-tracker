import { useApp } from "../context/AppContext";
import { UI, fmt } from "../data/languages";
import { GENESIS_1 } from "../data/genesis1";
import { clearCache } from "../lib/db";

const CACHE_CAPS = [20, 50, 100, 200];

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, settings, updateSettings, cacheUsageMB, refreshCacheUsage, toast } = useApp();
  const t = UI[lang];
  const capIndex = Math.max(0, CACHE_CAPS.indexOf(settings.cacheCapMB));
  const cap = CACHE_CAPS[capIndex] ?? 50;
  const pct = Math.min(100, (cacheUsageMB / cap) * 100);

  return (
    <div className={`modal-screen${open ? " open" : ""}`}>
      <div className="modal-head">
        <h2>{t.drawerSettings}</h2>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &#10005;
        </button>
      </div>
      <div className="modal-body">
        <div className="settings-section">
          <div className="settings-label">{t.fontSizeLabel}</div>
          <input
            className="settings-slider"
            type="range"
            min={0.85}
            max={1.35}
            step={0.05}
            value={settings.fontScale}
            onChange={(e) => {
              const v = Number(e.target.value);
              updateSettings({ fontScale: v });
              document.documentElement.style.setProperty("--font-scale", String(v));
            }}
          />
          <div className="font-preview">{`1:1  ${GENESIS_1[lang].verses[0].t}`}</div>
        </div>

        <div className="settings-section">
          <div className="settings-label">{t.themeLabel}</div>
          <div className="seg-row">
            {(["light", "dark", "auto"] as const).map((choice) => (
              <button
                key={choice}
                type="button"
                className={`seg-btn${settings.theme === choice ? " active" : ""}`}
                onClick={() => updateSettings({ theme: choice })}
              >
                {choice === "light" ? t.themeLight : choice === "dark" ? t.themeDark : t.themeAuto}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-label">{t.aiCacheLabel}</div>
          <div className="cache-gauge">
            <div className="cache-gauge-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="cache-meta">
            <span>{fmt(t.cacheUsedTpl, { n: cacheUsageMB })}</span>
            <span>{fmt(t.cacheCapTpl, { n: `${cap} MB` })}</span>
          </div>
          <input
            className="settings-slider"
            type="range"
            min={0}
            max={CACHE_CAPS.length - 1}
            step={1}
            value={capIndex}
            style={{ marginTop: 10 }}
            onChange={(e) => updateSettings({ cacheCapMB: CACHE_CAPS[Number(e.target.value)] })}
          />
          <div className="settings-row" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <span>{t.keepFavLabel}</span>
            <div
              className={`toggle-switch${settings.keepFavorites ? " on" : ""}`}
              onClick={() => updateSettings({ keepFavorites: !settings.keepFavorites })}
              role="switch"
              aria-checked={settings.keepFavorites}
              tabIndex={0}
            >
              <div className="knob" />
            </div>
          </div>
          <div className="cache-explain">{t.cacheExplain}</div>
          <button
            type="button"
            className="clear-btn"
            onClick={async () => {
              await clearCache();
              refreshCacheUsage();
              toast(t.clearedMsg);
            }}
          >
            {t.clearCacheBtn}
          </button>
        </div>

        <div className="settings-section">
          <div className="settings-label">AI endpoint (advanced)</div>
          <input
            className="endpoint-input"
            type="url"
            placeholder="https://your-proxy.example.com/api/generate-insights"
            value={settings.aiEndpoint}
            onChange={(e) => updateSettings({ aiEndpoint: e.target.value })}
          />
          <div className="cache-explain">
            Optional: point this at your own deployed proxy (see server/generate-insights.js) to generate new
            chapters with AI. Never put an API key directly here — the endpoint should hold the key server-side.
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-label">{t.aboutLabel}</div>
          <div className="about-row">
            <span>{t.versionLabel}</span>
            <span className="v">0.1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
