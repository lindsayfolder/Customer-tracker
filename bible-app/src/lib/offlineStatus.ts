// Ground-truth check of how much of the app's one-time offline download
// has actually landed in Cache Storage — not just "is a service worker
// registered," which can be true long before the ~30MB precache finishes.
// Used to show the reader a real "ready to go offline" signal instead of
// leaving them to guess (see the app's Settings screen).

// Kept in sync with the real total from `npm run build` output ("precache
// N entries"). A safety margin below this still counts as ready, since a
// couple of low-priority entries lagging (or a small drift after a future
// content addition) shouldn't perpetually block the "ready" state.
export const EXPECTED_PRECACHE_ENTRIES = 519;
const READY_THRESHOLD = Math.floor(EXPECTED_PRECACHE_ENTRIES * 0.95);

export async function getCachedEntryCount(): Promise<number> {
  if (typeof caches === "undefined") return 0;
  try {
    const keys = await caches.keys();
    const precacheKey = keys.find((k) => k.startsWith("workbox-precache"));
    if (!precacheKey) return 0;
    const cache = await caches.open(precacheKey);
    const reqs = await cache.keys();
    return reqs.length;
  } catch {
    return 0;
  }
}

export function isReadyCount(count: number): boolean {
  return count >= READY_THRESHOLD;
}
