import { useEffect, useState } from "react";

// TEMPORARY — diagnosing a real-device-only bottom dead-space bug that
// headless Chromium testing can't reproduce (it has no browser-chrome
// deduction behavior to get wrong, so every simulated check passes while
// the real device still shows a gap). This renders the actual numbers in
// play directly on screen so they can be read off a screenshot from the
// affected phone, instead of guessing at further CSS fixes blind. Remove
// this component and its mount point once the real cause is confirmed.
export function DebugViewportBadge() {
  const [info, setInfo] = useState("");

  useEffect(() => {
    function update() {
      const appHeight = getComputedStyle(document.documentElement).getPropertyValue("--app-height").trim();
      const shellRect = document.querySelector(".app-shell")?.getBoundingClientRect();
      const safeBottom = getComputedStyle(document.documentElement).getPropertyValue("--sab-probe").trim();
      const nav = navigator as Navigator & { standalone?: boolean };
      const parts = [
        `iH:${window.innerHeight}`,
        `vv:${Math.round(window.visualViewport?.height ?? -1)}`,
        `sh:${window.screen?.height ?? -1}`,
        `dch:${document.documentElement.clientHeight}`,
        `ah:${appHeight || "unset"}`,
        `shell:${shellRect ? Math.round(shellRect.height) : "?"}`,
        `dpr:${window.devicePixelRatio}`,
        `standalone:${nav.standalone ?? "?"}`,
        `sab:${safeBottom || "?"}`,
      ];
      setInfo(parts.join(" "));
    }
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    const t = window.setInterval(update, 1000);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.clearInterval(t);
    };
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
        background: "rgba(0,0,0,0.75)",
        color: "#5f5",
        padding: "2px 4px",
        pointerEvents: "none",
        wordBreak: "break-all",
      }}
    >
      {info}
    </div>
  );
}
