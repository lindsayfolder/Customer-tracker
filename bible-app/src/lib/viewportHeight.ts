// iOS Safari (especially when the app is added to the home screen and runs
// standalone) has a long-standing history of `100dvh` not matching the
// actual visible viewport — on some versions it reports a value taller than
// what's really on screen, leaving a gap below bottom-anchored elements like
// the chapter toolbar or a modal's content. `window.visualViewport` (falling
// back to `window.innerHeight`) reflects the real rendered viewport, so we
// mirror it into a custom property for CSS to use.
//
// The failure can go the other way too, though: on some real devices
// visualViewport.height has been observed under-reporting the true
// viewport, which produces the exact same symptom (a dead band at the
// bottom) for the opposite reason. theme.css guards against both by taking
// max(--app-height, 100dvh) rather than trusting this value outright — this
// property is a correction in whichever direction is needed, not an
// authoritative override.
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
