import { BOOKS } from "../data/books";
import { BOOKS_WITH_MAPS } from "./maps";

interface Task {
  url: string;
  cacheName: string;
}

const BIBLE_VERSIONS = ["en", "web", "zh-hant", "zh-hans"] as const;
const INSIGHT_LANGS = ["en", "zh-hant", "zh-hans"] as const;
const EXPLAIN_LANGS = ["en", "zh-hant", "zh-hans"] as const;
const CHARACTER_LANGS = ["en", "zh-hant", "zh-hans"] as const;
const INTRO_LANGS = ["en", "zh-hant", "zh-hans"] as const;

interface AppearanceFile {
  chapters: Record<string, string[]>;
}

// The book-enumerable slice of the library: one task per book per
// version/language, so its size is knowable from BOOKS.length alone
// without fetching anything first. Character *bios* are deliberately NOT
// part of this — which ids exist isn't derivable from the book list the
// way every other track is; see discoverCharacterIds below. Each book's
// own appearance manifest IS listed here (it's one URL per book, same as
// every other track), and discoverCharacterIds reuses whatever this loop
// already cached for it rather than re-fetching.
function buildFixedManifest(base: string): Task[] {
  const tasks: Task[] = [];
  for (const book of BOOKS) {
    for (const v of BIBLE_VERSIONS) {
      tasks.push({ url: `${base}bible/${v}/${book.id}.json`, cacheName: "bible-text-v3" });
    }
    for (const l of INSIGHT_LANGS) {
      tasks.push({ url: `${base}insights/${l}/${book.id}.json`, cacheName: "bible-insights-v2" });
    }
    for (const l of EXPLAIN_LANGS) {
      tasks.push({ url: `${base}explain/${l}/${book.id}.json`, cacheName: "bible-explain-v2" });
    }
    tasks.push({ url: `${base}characters/appearances/${book.id}.json`, cacheName: "bible-characters-v1" });
    if (BOOKS_WITH_MAPS.has(book.id)) {
      tasks.push({ url: `${base}maps/${book.id}.svg`, cacheName: "bible-maps" });
      tasks.push({ url: `${base}maps/${book.id}-zh.svg`, cacheName: "bible-maps" });
    }
  }
  for (const l of INTRO_LANGS) {
    tasks.push({ url: `${base}bookintro/${l}.json`, cacheName: "bible-book-intro" });
  }
  return tasks;
}

// A rough lower bound for the progress bar's very first paint, before the
// real total — which also includes character bios, and so depends on how
// many named individuals actually exist (see discoverCharacterIds) — is
// known a few milliseconds later. Computed from the same book list and
// constants buildFixedManifest uses, rather than a hand-counted number, so
// it can't quietly drift out of sync as books/languages/mapped books change.
export const TOTAL_CONTENT_FILES =
  BOOKS.length * (BIBLE_VERSIONS.length + INSIGHT_LANGS.length + EXPLAIN_LANGS.length + 1) +
  BOOKS_WITH_MAPS.size * 2 +
  INTRO_LANGS.length;

const CONCURRENCY = 6;
const MAX_ATTEMPTS_PER_URL = 4;
const FETCH_TIMEOUT_MS = 20000;

// Plain fetch() has no default timeout, so a single connection that stalls
// instead of erroring — common on Android when the OS throttles or drops a
// background socket mid-request — never settles. Promise.all over a batch
// then waits on it forever, freezing the whole download exactly where it
// stood (a reader stuck at some fixed count forever). Forcing each request
// to fail after a bounded wait turns that hang into an ordinary retryable
// failure instead.
function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(url, { cache: "no-store", signal: controller.signal }).finally(() => clearTimeout(timer));
}

let running = false;

// Character ids aren't enumerable from BOOKS the way every other track is
// — they're discovered by reading each book's own appearance manifest
// (public/characters/appearances/<book>.json). Those 66 files are also
// listed as ordinary tasks in buildFixedManifest, so this reuses whatever
// the main loop has already cached for a book (cache.match) rather than
// re-fetching, and only hits the network for ones that aren't cached yet.
// Best-effort and un-retried by design: a book this misses on this pass
// simply contributes no ids this run, but its own appearance-manifest
// task still gets the main loop's full retry treatment, so a transient
// failure here self-heals the next time the app launches and this runs
// again — consistent with the rest of this module's "resumable across
// relaunches" approach rather than needing its own retry logic.
async function discoverCharacterIds(base: string): Promise<Set<string>> {
  const ids = new Set<string>();
  const cache = await caches.open("bible-characters-v1");
  await Promise.all(
    BOOKS.map(async (book) => {
      const url = `${base}characters/appearances/${book.id}.json`;
      try {
        let res = await cache.match(url);
        if (!res) {
          const fresh = await fetchWithTimeout(url);
          if (!fresh.ok) return;
          await cache.put(url, fresh.clone());
          res = fresh;
        }
        const data = (await res.json()) as AppearanceFile;
        for (const chapterIds of Object.values(data.chapters)) {
          for (const id of chapterIds) ids.add(id);
        }
      } catch {
        // Missing, unreachable, or unparseable for this book — fine, it
        // just contributes no ids; see the function comment above.
      }
    }),
  );
  return ids;
}

// Downloads the whole offline content library (scripture, AI insights and
// explanations, character bios, book intros, maps) from ordinary page
// code, into the exact cache names the app's runtime-caching rules already
// read from (see vite.config.ts) — so a normal lazy fetch from
// scripture.ts/insights.ts/explain.ts/characters.ts/bookIntro.ts/maps.ts
// transparently finds it pre-cached, no other code changes needed.
//
// Deliberately NOT done as one atomic operation inside the service
// worker's install event: iOS Safari doesn't guarantee that event can run
// for as long as this much content over hundreds of requests takes, and if
// it gets suspended partway there's no way to resume — the reader is just
// stuck. This version fetches in small concurrent batches from a
// foregrounded tab, skips anything already cached (so it's resumable
// across reloads/app relaunches for free), pauses while the tab is hidden
// instead of wasting attempts iOS won't actually run, and retries
// individual failures a few times without blocking the rest of the batch.
export async function runBulkDownload(onProgress?: (done: number, total: number) => void): Promise<void> {
  if (running || typeof caches === "undefined") return;
  running = true;
  try {
    const base = import.meta.env.BASE_URL;
    const fixed = buildFixedManifest(base);

    const report = async (total: number) => {
      if (!onProgress) return;
      onProgress(await countCachedEntries(), total);
    };

    // First report uses the fixed-size portion's own real count (not the
    // TOTAL_CONTENT_FILES estimate) as the total, so progress is accurate
    // from the very first paint even before character ids are known.
    await report(fixed.length);

    const characterIds = await discoverCharacterIds(base);
    const characterTasks: Task[] = [];
    for (const id of characterIds) {
      for (const lang of CHARACTER_LANGS) {
        characterTasks.push({ url: `${base}characters/${lang}/${id}.json`, cacheName: "bible-characters-v1" });
      }
    }

    const manifest = [...fixed, ...characterTasks];
    const attempts = new Map<string, number>();
    let pending = manifest.slice();

    await report(manifest.length);

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
            const res = await fetchWithTimeout(task.url);
            if (!res.ok) throw new Error(String(res.status));
            await cache.put(task.url, res);
          } catch {
            const n = (attempts.get(task.url) ?? 0) + 1;
            attempts.set(task.url, n);
            if (n < MAX_ATTEMPTS_PER_URL) pending.push(task);
          }
        }),
      );

      await report(manifest.length);
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
  for (const name of [
    "bible-text-v3",
    "bible-insights-v2",
    "bible-explain-v2",
    "bible-characters-v1",
    "bible-book-intro",
    "bible-maps",
  ]) {
    try {
      const cache = await caches.open(name);
      total += (await cache.keys()).length;
    } catch {
      // ignore
    }
  }
  return total;
}
