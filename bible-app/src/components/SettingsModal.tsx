import { useApp } from "../context/AppContext";
import { UI } from "../data/languages";
import { GENESIS_1 } from "../data/genesis1";

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, settings, updateSettings } = useApp();
  const t = UI[lang];

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
