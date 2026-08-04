import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { LangKey } from "../data/languages";

export interface AppSettings {
  id: "app";
  fontScale: number;
  theme: "light" | "dark" | "auto";
  lastLang: LangKey;
}

interface InkverseDB extends DBSchema {
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
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

export const DEFAULT_SETTINGS: AppSettings = {
  id: "app",
  fontScale: 1,
  theme: "auto",
  lastLang: "en",
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
