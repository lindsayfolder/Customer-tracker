import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Point } from "../data/genesis1";
import type { LangKey } from "../data/languages";

interface CacheEntry {
  key: string; // `${bookId}-${chapter}-${lang}`
  bookId: string;
  chapter: number;
  lang: LangKey;
  points: Point[];
  sizeBytes: number;
  lastAccessed: number;
  favorite: boolean;
}

export interface AppSettings {
  id: "app";
  fontScale: number;
  theme: "light" | "dark" | "auto";
  cacheCapMB: number;
  keepFavorites: boolean;
  lastLang: LangKey;
  aiEndpoint: string; // optional self-hosted proxy endpoint for AI generation
}

interface InkverseDB extends DBSchema {
  chapters: {
    key: string;
    value: CacheEntry;
    indexes: { "by-lastAccessed": number };
  };
  settings: {
    key: string;
    value: AppSettings;
  };
}

const DB_NAME = "inkverse";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<InkverseDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<InkverseDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore("chapters", { keyPath: "key" });
        store.createIndex("by-lastAccessed", "lastAccessed");
        db.createObjectStore("settings", { keyPath: "id" });
      },
    });
  }
  return dbPromise;
}

function cacheKey(bookId: string, chapter: number, lang: LangKey) {
  return `${bookId}-${chapter}-${lang}`;
}

function byteSize(points: Point[]): number {
  return new Blob([JSON.stringify(points)]).size;
}

export const DEFAULT_SETTINGS: AppSettings = {
  id: "app",
  fontScale: 1,
  theme: "auto",
  cacheCapMB: 50,
  keepFavorites: true,
  lastLang: "en",
  aiEndpoint: "",
};

export async function loadSettings(): Promise<AppSettings> {
  const db = await getDb();
  const s = await db.get("settings", "app");
  return s ?? DEFAULT_SETTINGS;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await getDb();
  await db.put("settings", settings);
}

export async function getCachedPoints(bookId: string, chapter: number, lang: LangKey): Promise<Point[] | null> {
  const db = await getDb();
  const entry = await db.get("chapters", cacheKey(bookId, chapter, lang));
  if (!entry) return null;
  entry.lastAccessed = Date.now();
  await db.put("chapters", entry);
  return entry.points;
}

export async function putCachedPoints(
  bookId: string,
  chapter: number,
  lang: LangKey,
  points: Point[],
  capMB: number,
  keepFavoritesExempt: boolean,
): Promise<void> {
  const db = await getDb();
  const key = cacheKey(bookId, chapter, lang);
  const existing = await db.get("chapters", key);
  const entry: CacheEntry = {
    key,
    bookId,
    chapter,
    lang,
    points,
    sizeBytes: byteSize(points),
    lastAccessed: Date.now(),
    favorite: existing?.favorite ?? false,
  };
  await db.put("chapters", entry);
  await evictIfOverCap(capMB, keepFavoritesExempt);
}

export async function setFavorite(bookId: string, chapter: number, lang: LangKey, favorite: boolean): Promise<void> {
  const db = await getDb();
  const key = cacheKey(bookId, chapter, lang);
  const entry = await db.get("chapters", key);
  if (!entry) return;
  entry.favorite = favorite;
  await db.put("chapters", entry);
}

export async function clearCache(): Promise<void> {
  const db = await getDb();
  await db.clear("chapters");
}

export async function getCacheUsageMB(): Promise<number> {
  const db = await getDb();
  const all = await db.getAll("chapters");
  const totalBytes = all.reduce((sum, e) => sum + e.sizeBytes, 0);
  return Math.round((totalBytes / (1024 * 1024)) * 10) / 10;
}

// Least-recently-used eviction: when total cache size exceeds the cap,
// remove the oldest non-favorite entries first. Favorites are only evicted
// if keepFavoritesExempt is false and non-favorites alone can't fit the cap.
async function evictIfOverCap(capMB: number, keepFavoritesExempt: boolean): Promise<void> {
  const db = await getDb();
  const capBytes = capMB * 1024 * 1024;
  const all = await db.getAll("chapters");
  let totalBytes = all.reduce((sum, e) => sum + e.sizeBytes, 0);
  if (totalBytes <= capBytes) return;

  all.sort((a, b) => a.lastAccessed - b.lastAccessed);
  const tx = db.transaction("chapters", "readwrite");
  for (const entry of all) {
    if (totalBytes <= capBytes) break;
    if (entry.favorite && keepFavoritesExempt) continue;
    await tx.store.delete(entry.key);
    totalBytes -= entry.sizeBytes;
  }
  await tx.done;
}
