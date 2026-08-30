import { useEffect, useState } from "react";
import { useApp, TOTAL_CONTENT_FILES } from "../context/AppContext";
import { UI, LANGUAGES, fmt } from "../data/languages";
import { GENESIS_1 } from "../data/genesis1";
import { tts } from "../lib/tts";

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    lang,
    settings,
    updateSettings,
    offlineReady,
    offlineCount,
    updateAvailable,
    checkingForUpdate,
    checkForUpdate,
    applyUpdate,
  } = useApp();
  const t = UI[lang];

  // Voices load asynchronously on some browsers (empty on first paint,
  // populated once "voiceschanged" fires), so this re-reads the list on
  // that event rather than assuming it's ready immediately.
  const speechLang = LANGUAGES.find((l) => l.key === lang)?.speechLang ?? "en-US";
  const langPrefix = speechLang.split("-")[0];
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => tts.listVoices(langPrefix));
  useEffect(() => {
    setVoices(tts.listVoices(langPrefix));
    return tts.subscribeVoicesChanged(() => setVoices(tts.listVoices(langPrefix)));
  }, [langPrefix]);
  // If the saved choice no longer appears in the (now novelty-filtered)
  // voice list — e.g. it was a novelty voice picked before that filter
  // existed — treat it as unset rather than showing a dropdown selection
  // that doesn't match any option.
  const savedVoiceURI = settings.voiceByLang[lang] ?? "";
  const chosenVoiceURI = voices.some((v) => v.voiceURI === savedVoiceURI) ? savedVoiceURI : "";

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
            max={5}
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
          <div className="settings-label">{t.voiceLabel}</div>
          {voices.length > 0 ? (
            <div className="voice-row">
              <select
                className="voice-select"
                value={chosenVoiceURI}
                onChange={(e) => updateSettings({ voiceByLang: { ...settings.voiceByLang, [lang]: e.target.value || undefined } })}
              >
                <option value="">{t.voiceAutoLabel}</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="voice-preview-btn"
                onClick={() => tts.toggle("voice-preview", GENESIS_1[lang].verses[0].t, lang, chosenVoiceURI || undefined)}
              >
                {t.voicePreviewLabel}
              </button>
            </div>
          ) : (
            <div className="empty-note">{t.voiceNoneLabel}</div>
          )}
        </div>

        <div className="settings-section">
          <div className="settings-label">{t.offlineStatusLabel}</div>
          <div className={`offline-status${offlineReady ? " ready" : ""}`}>
            <span className="dot" />
            {offlineReady ? t.offlineReadyLabel : fmt(t.offlinePreparingTpl, { n: offlineCount, total: TOTAL_CONTENT_FILES })}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-label">{t.updateStatusLabel}</div>
          {updateAvailable ? (
            <button type="button" className="update-btn available" onClick={() => applyUpdate()}>
              {t.updateAvailableLabel} — {t.updateApplyButton}
            </button>
          ) : (
            <button type="button" className="update-btn" disabled={checkingForUpdate} onClick={() => checkForUpdate()}>
              {checkingForUpdate ? t.updateCheckingLabel : t.updateCheckButton}
            </button>
          )}
          {!updateAvailable && !checkingForUpdate && (
            <div className="update-hint">{t.updateUpToDateLabel}</div>
          )}
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
