import { useEffect, useState } from "react";

// TEMPORARY — diagnosing a real-device-only chapter-player bug (reported:
// chapter flips correctly, but then the newly-flipped-to chapter starts
// over/repeats instead of progressing) that a deterministic fake
// speechSynthesis in Playwright testing did not reproduce, the same way
// headless Chromium couldn't reproduce the earlier viewport bug. App.tsx
// pushes a short line onto window.__playerLog on every tts.speak() call
// and every onEnd callback, rendered below as a rolling window — but a
// short chapter can loop many times over several minutes before anyone
// notices and screenshots it, easily overwriting that window before it's
// captured. window.__playerSummary is a persistent (never-rolls-off)
// counter of how many times in a row the current chapter has been
// (re-)spoken, plus the worst streak seen all session, shown at the top
// in red once it exceeds 1 — this survives regardless of how long the
// loop ran before a screenshot was taken. Remove this component, its
// mount point, and the window.__playerLog/__playerSummary writes once the
// real cause is confirmed.
export function DebugPlayerLog() {
  const [lines, setLines] = useState<string[]>([]);
  const [summary, setSummary] = useState<{ key: string; count: number; maxKey: string; maxCount: number } | null>(null);

  useEffect(() => {
    const w = window as typeof window & {
      __playerLog?: string[];
      __playerSummary?: { key: string; count: number; maxKey: string; maxCount: number };
    };
    if (!w.__playerLog) w.__playerLog = [];
    const id = window.setInterval(() => {
      setLines([...(w.__playerLog ?? [])].slice(-20));
      setSummary(w.__playerSummary ? { ...w.__playerSummary } : null);
    }, 300);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        fontSize: "9px",
        lineHeight: 1.3,
        fontFamily: "monospace",
        background: "rgba(0,0,0,0.8)",
        color: "#5f5",
        padding: "2px 4px",
        pointerEvents: "none",
        maxHeight: "44vh",
        overflow: "hidden",
      }}
    >
      {summary && (
        <div style={{ color: summary.maxCount > 1 ? "#f55" : "#ff5", fontWeight: "bold", marginBottom: 2 }}>
          now: {summary.key} x{summary.count} | worst this session: {summary.maxKey} x{summary.maxCount}
        </div>
      )}
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
}
