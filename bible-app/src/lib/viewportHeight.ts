// iOS Safari (especially when the app is added to the home screen and runs
// standalone) has a long-standing history of `100dvh` not matching the
// actual visible viewport — it can report a value taller than what's really
// on screen, leaving a gap below bottom-anchored elements like the chapter
// toolbar or a modal's content. `window.visualViewport` (falling back to
// `window.innerHeight`) reflects the real rendered viewport, so we mirror it
// into a custom property and let CSS prefer that over `100dvh`.
function setAppHeight() {
  const height = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${height}px`);
}

export function initViewportHeight() {
  setAppHeight();
  window.addEventListener("resize", setAppHeight);
  window.addEventListener("orientationchange", setAppHeight);
  window.visualViewport?.addEventListener("resize", setAppHeight);
}
