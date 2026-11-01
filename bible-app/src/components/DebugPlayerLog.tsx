import { useEffect, useState } from "react";

// TEMPORARY — diagnosing a real-device-only chapter-player bug (reported:
// chapter flips correctly, but then the newly-flipped-to chapter starts
// over/repeats instead of progressing) that a deterministic fake
// speechSynthesis in Playwright testing did not reproduce, the same way
// headless Chromium couldn't reproduce the earlier viewport bug. App.tsx
// pushes a short line onto window.__playerLog on every tts.speak() call
// and every onEnd callback; this renders the last several as a small
// on-screen readout so they can be read off a screenshot from the
// affected phone instead of guessing further. Remove this component, its
// mount point, and the window.__playerLog pushes once the real cause is
// confirmed.
export function DebugPlayerLog() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const w = window as typeof window & { __playerLog?: string[] };
    if (!w.__playerLog) w.__playerLog = [];
    const id = window.setInterval(() => {
      setLines([...(w.__playerLog ?? [])].slice(-20));
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
        maxHeight: "40vh",
        overflow: "hidden",
      }}
    >
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
}
