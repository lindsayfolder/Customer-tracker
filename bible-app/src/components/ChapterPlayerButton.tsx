import { UI, type LangKey } from "../data/languages";

export type ChapterPlayerState = "idle" | "playing" | "paused";

// Controlled, unlike ListenButton (which owns its own tts subscription) —
// this one drives a chapter-to-chapter playback session that lives in
// App.tsx, since only App.tsx knows how to load the next chapter's verses.
export function ChapterPlayerButton({
  lang,
  state,
  onToggle,
}: {
  lang: LangKey;
  state: ChapterPlayerState;
  onToggle: () => void;
}) {
  const t = UI[lang];
  const label = state === "playing" ? t.listenPauseLabel : state === "paused" ? t.listenResumeLabel : t.listenLabel;

  return (
    <button type="button" className={`listen-btn${state !== "idle" ? " playing" : ""}`} onClick={onToggle}>
      <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
        {state === "playing" ? (
          <>
            <rect x="5" y="4" width="4" height="12" rx="1" />
            <rect x="11" y="4" width="4" height="12" rx="1" />
          </>
        ) : (
          <path d="M6 4l10 6-10 6V4z" />
        )}
      </svg>
      <span>{label}</span>
    </button>
  );
}
