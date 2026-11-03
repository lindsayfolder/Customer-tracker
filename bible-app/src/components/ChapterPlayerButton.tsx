import { UI, type LangKey } from "../data/languages";

export type ChapterPlayerState = "idle" | "playing" | "paused";

// Icon-only, sized to match the toolbar's prev/next arrows (.toolbar-nav-btn)
// since it lives between them — see the label (via aria-label, not visible
// text) for why a plain play/pause glyph is enough on its own: this is a
// standard media-transport convention, and idle/paused intentionally share
// the same ▶ glyph (both mean "tap to play from here").
//
// Controlled, unlike ListenButton (which owns its own tts subscription) —
// this one drives a chapter-to-chapter playback session that lives in
// App.tsx, since only App.tsx knows how to load the next chapter's verses.
export function ChapterPlayerButton({
  lang,
  state,
  disabled,
  onToggle,
}: {
  lang: LangKey;
  state: ChapterPlayerState;
  disabled?: boolean;
  onToggle: () => void;
}) {
  const t = UI[lang];
  const label = state === "playing" ? t.listenPauseLabel : state === "paused" ? t.listenResumeLabel : t.listenLabel;

  return (
    <div className="toolbar-play-btn-wrap">
      <button
        type="button"
        className={`toolbar-play-btn${state !== "idle" ? " active" : ""}`}
        onClick={onToggle}
        disabled={disabled}
        aria-label={label}
      >
        <svg width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
          {state === "playing" ? (
            <>
              <rect x="5" y="4" width="4" height="12" rx="1" />
              <rect x="11" y="4" width="4" height="12" rx="1" />
            </>
          ) : (
            <path d="M6 4l10 6-10 6V4z" />
          )}
        </svg>
      </button>
    </div>
  );
}
