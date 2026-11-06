// iOS Safari (especially when the app is added to the home screen and runs
// standalone) has a long-standing history of `100dvh` not matching the
// actual visible viewport. `window.visualViewport` (falling back to
// `window.innerHeight`) is the usual fix for that, so we mirror it into a
// custom property for CSS to use — but on a real iPhone 15 Plus, with this
// app installed standalone (viewport-fit=cover is set, so the webview does
// render edge-to-edge across the full physical screen), visualViewport.height
// *and* innerHeight *and* 100dvh all consistently under-reported by exactly
// the Dynamic Island's height (873px measured vs. window.screen.height's
// correct 932px) — confirmed via an on-screen debug readout, not guessed.
// That left a dead band below the bottom-anchored toolbar/content that no
// in-page layout fix could close, since every "real" viewport measurement
// available agreed on the same wrong number.
//
// window.screen.height is the one measurement that reported correctly, so
// it's folded in as a candidate too — guarded by an orientation check (only
// trusted when screen and viewport report the same portrait/landscape
// shape) in case it's ever stale or unrotated on some other engine.
//
// That screen.height trick is iOS-specific, though, and must not run on
// Android: there, screen.height reports the device's full physical screen
// *including* system UI chrome (status bar, nav/gesture bar) that
// visualViewport correctly excludes — the opposite relationship from the
// iOS bug. Taking Math.max() of the two on Android picks the inflated
// screen.height, growing --app-height past the real visible viewport and
// pushing the whole bottom toolbar (and its play/pause button) off-screen
// entirely — confirmed by reproducing a real Android screen/viewport
// height split (915 vs 846px) and watching the toolbar end up positioned
// entirely below the visible window.
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

function setAppHeight() {
  const vv = window.visualViewport;
  const vvHeight = vv?.height ?? window.innerHeight;
  const vvWidth = vv?.width ?? window.innerWidth;
  const sameOrientation = (window.screen.height >= window.screen.width) === (vvHeight >= vvWidth);
  const height = isIOS && sameOrientation ? Math.max(vvHeight, window.screen.height) : vvHeight;
  document.documentElement.style.setProperty("--app-height", `${height}px`);
}

export function initViewportHeight() {
  setAppHeight();
  window.addEventListener("resize", setAppHeight);
  window.addEventListener("orientationchange", setAppHeight);
  window.visualViewport?.addEventListener("resize", setAppHeight);
}
