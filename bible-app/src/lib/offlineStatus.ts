// Ground-truth check of how much of the app's one-time offline download
// has actually landed in Cache Storage — not just "is a service worker
// registered," which can be true long before the content actually finishes
// downloading. Used to show the reader a real "ready to go offline" signal
// instead of leaving them to guess (see the app's Settings screen).
//
// Counts the same three named caches lib/bulkOfflineDownload.ts writes
// into (and vite.config.ts's runtime-caching rules also read from), not
// the workbox app-shell precache — content is downloaded separately from
// the small, fast app-shell precache. See TOTAL_CONTENT_FILES in
// bulkOfflineDownload.ts for the expected total (504: kept in sync with
// the book/version/language counts there).

const CONTENT_CACHE_NAMES = ["bible-text-v2", "bible-insights", "bible-maps"];

export async function getCachedEntryCount(): Promise<number> {
  if (typeof caches === "undefined") return 0;
  let total = 0;
  for (const name of CONTENT_CACHE_NAMES) {
    try {
      const cache = await caches.open(name);
      total += (await cache.keys()).length;
    } catch {
      // ignore
    }
  }
  return total;
}

export function isReadyCount(count: number, total: number): boolean {
  return count >= Math.floor(total * 0.98);
}

// Cache buckets renamed with a -v2 (etc.) suffix when their content changes
// (see vite.config.ts) leave their old-named bucket orphaned — nothing ever
// reads from it again, but the browser won't free that storage on its own.
// Runs once at startup to reclaim it; deleting a cache that doesn't exist is
// a harmless no-op, so this is safe to call unconditionally on every boot.
const RETIRED_CACHE_NAMES = ["bible-text", "bible-search-index", "bible-explain"];

export async function cleanupLegacyCaches(): Promise<void> {
  if (typeof caches === "undefined") return;
  for (const name of RETIRED_CACHE_NAMES) {
    try {
      await caches.delete(name);
    } catch {
      // ignore
    }
  }
}
