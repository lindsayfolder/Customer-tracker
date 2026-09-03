import { BOOKS } from "../data/books";
import { BOOKS_WITH_MAPS } from "./maps";

interface Task {
  url: string;
  cacheName: string;
}

const BIBLE_VERSIONS = ["en", "web", "zh-hant", "zh-hans"] as const;
const INSIGHT_LANGS = ["en", "zh-hant", "zh-hans"] as const;

function buildManifest(base: string): Task[] {
  const tasks: Task[] = [];
  for (const book of BOOKS) {
    for (const v of BIBLE_VERSIONS) {
      tasks.push({ url: `${base}bible/${v}/${book.id}.json`, cacheName: "bible-text-v2" });
    }
    for (const l of INSIGHT_LANGS) {
      tasks.push({ url: `${base}insights/${l}/${book.id}.json`, cacheName: "bible-insights" });
    }
    if (BOOKS_WITH_MAPS.has(book.id)) {
      tasks.push({ url: `${base}maps/${book.id}.svg`, cacheName: "bible-maps" });
      tasks.push({ url: `${base}maps/${book.id}-zh.svg`, cacheName: "bible-maps" });
    }
  }
  return tasks;
}

export const TOTAL_CONTENT_FILES = 66 * 4 + 66 * 3 + 21 * 2; // 504

const CONCURRENCY = 6;
const MAX_ATTEMPTS_PER_URL = 4;

let running = false;

// Downloads the whole offline content library (scripture, AI insights,
// maps) from ordinary page code, into the exact cache names the app's
// runtime-caching rules already read from (see vite.config.ts) — so a
// normal lazy fetch from scripture.ts/insights.ts/maps.ts transparently
// finds it pre-cached, no other code changes needed.
//
// Deliberately NOT done as one atomic operation inside the service
// worker's install event: iOS Safari doesn't guarantee that event can run
// for as long as ~30MB over hundreds of requests takes, and if it gets
// suspended partway there's no way to resume — the reader is just stuck.
// This version fetches in small concurrent batches from a foregrounded
// tab, skips anything already cached (so it's resumable across reloads/
// app relaunches for free), pauses while the tab is hidden instead of
// wasting attempts iOS won't actually run, and retries individual
// failures a few times without blocking the rest of the batch.
export async function runBulkDownload(onProgress?: (done: number, total: number) => void): Promise<void> {
  if (running || typeof caches === "undefined") return;
  running = true;
  try {
    const base = import.meta.env.BASE_URL;
    const manifest = buildManifest(base);
    const attempts = new Map<string, number>();
    let pending = manifest.slice();

    const report = async () => {
      if (!onProgress) return;
      onProgress(await countCachedEntries(), manifest.length);
    };

    await report();

    while (pending.length > 0) {
      if (document.visibilityState === "hidden") {
        await waitForVisible();
      }

      const batch = pending.splice(0, CONCURRENCY);
      await Promise.all(
        batch.map(async (task) => {
          try {
            const cache = await caches.open(task.cacheName);
            const already = await cache.match(task.url);
            if (already) return;
            const res = await fetch(task.url, { cache: "no-store" });
            if (!res.ok) throw new Error(String(res.status));
            await cache.put(task.url, res);
          } catch {
            const n = (attempts.get(task.url) ?? 0) + 1;
            attempts.set(task.url, n);
            if (n < MAX_ATTEMPTS_PER_URL) pending.push(task);
          }
        }),
      );

      await report();
    }
  } finally {
    running = false;
  }
}

function waitForVisible(): Promise<void> {
  return new Promise((resolve) => {
    function onChange() {
      if (document.visibilityState === "visible") {
        document.removeEventListener("visibilitychange", onChange);
        resolve();
      }
    }
    document.addEventListener("visibilitychange", onChange);
  });
}

async function countCachedEntries(): Promise<number> {
  let total = 0;
  for (const name of ["bible-text-v2", "bible-insights", "bible-maps"]) {
    try {
      const cache = await caches.open(name);
      total += (await cache.keys()).length;
    } catch {
      // ignore
    }
  }
  return total;
}
