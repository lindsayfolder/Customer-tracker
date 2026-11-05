import { useEffect, useState } from "react";

// TEMPORARY diagnostic for a real-device "takes 1-2s to open" report that
// doesn't reproduce in local/synthetic testing — same approach used earlier
// for the viewport-height and chapter-player bugs: get real on-device
// numbers via an on-screen overlay, then delete this once diagnosed.
export function DebugLoadTiming() {
  const [, force] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => force((n) => n + 1), 200);
    const stop = window.setTimeout(() => window.clearInterval(id), 8000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(stop);
    };
  }, []);

  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const fcp = performance.getEntriesByType("paint").find((p) => p.name === "first-contentful-paint");
  const t = (window as unknown as { __loadTiming?: Record<string, number> }).__loadTiming ?? {};
  const swControlled = typeof navigator !== "undefined" && !!navigator.serviceWorker?.controller;

  const row = (label: string, ms: number | undefined) => `${label}: ${ms != null ? Math.round(ms) + "ms" : "–"}`;

  return (
    <div
      style={{
        position: "fixed",
        top: 8,
        left: 8,
        zIndex: 99999,
        background: "rgba(0,0,0,0.85)",
        color: "#0f0",
        font: "10px/1.4 monospace",
        padding: "6px 8px",
        borderRadius: 6,
        whiteSpace: "pre",
        pointerEvents: "none",
      }}
    >
      {"DEBUG load timing\n"}
      {row("navigationStart→responseStart", nav?.responseStart)}
      {"\n"}
      {row("→domInteractive", nav?.domInteractive)}
      {"\n"}
      {row("→domContentLoaded", nav?.domContentLoadedEventEnd)}
      {"\n"}
      {row("→loadEvent", nav?.loadEventEnd)}
      {"\n"}
      {row("→firstContentfulPaint", fcp?.startTime)}
      {"\n"}
      {row("→scriptStart", t.scriptStart)}
      {"\n"}
      {row("→settingsReady", t.settingsReady)}
      {"\n"}
      {row("→firstVersesLoaded", t.firstVersesLoaded)}
      {"\n"}
      {`SW controlled: ${swControlled}`}
    </div>
  );
}
