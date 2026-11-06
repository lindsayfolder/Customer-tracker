import { BOOKS } from "./books";
import type { LangKey } from "./languages";

export interface PlanReading {
  bookId: string;
  chapter: number;
}

export interface ReadingPlan {
  id: string;
  title: Record<LangKey, string>;
  description: Record<LangKey, string>;
  // One entry per day; each day is the list of chapters to read that day.
  // Generated from BOOKS' chapter counts (see distribute() below) rather
  // than hand-curated day-by-day content — a schedule, not a devotional —
  // so the whole library is a few hundred bytes of plain data instead of
  // new bundled content to fetch and cache.
  days: PlanReading[][];
}

function flattenChapters(bookIds: string[]): PlanReading[] {
  const out: PlanReading[] = [];
  for (const id of bookIds) {
    const book = BOOKS.find((b) => b.id === id);
    if (!book) continue;
    for (let c = 1; c <= book.chapters; c++) out.push({ bookId: id, chapter: c });
  }
  return out;
}

// Spreads a flat chapter list across totalDays as evenly as possible — a
// plain Math.ceil(readings.length / totalDays) chunk size would dump every
// leftover chapter onto the final day instead of spreading the remainder
// across the first few days.
function distribute(readings: PlanReading[], totalDays: number): PlanReading[][] {
  const days: PlanReading[][] = [];
  const base = Math.floor(readings.length / totalDays);
  const extra = readings.length % totalDays;
  let idx = 0;
  for (let d = 0; d < totalDays; d++) {
    const count = base + (d < extra ? 1 : 0);
    days.push(readings.slice(idx, idx + count));
    idx += count;
  }
  return days;
}

const NT_IDS = BOOKS.filter((b) => b.testament === "NT").map((b) => b.id);
const ALL_IDS = BOOKS.map((b) => b.id);
const GOSPEL_IDS = ["mat", "mar", "luk", "joh"];

export const READING_PLANS: ReadingPlan[] = [
  {
    id: "nt-30",
    title: {
      en: "New Testament in 30 Days", web: "New Testament in 30 Days",
      "zh-hant": "30 天讀完新約", "zh-hans": "30 天读完新约",
    },
    description: {
      en: "The whole New Testament, Matthew through Revelation, spread evenly across 30 days.",
      web: "The whole New Testament, Matthew through Revelation, spread evenly across 30 days.",
      "zh-hant": "從馬太福音到啟示錄，新約全書平均分配在 30 天內讀完。",
      "zh-hans": "从马太福音到启示录，新约全书平均分配在 30 天内读完。",
    },
    days: distribute(flattenChapters(NT_IDS), 30),
  },
  {
    id: "gospels-14",
    title: {
      en: "The Four Gospels in 2 Weeks", web: "The Four Gospels in 2 Weeks",
      "zh-hant": "兩週讀完四福音書", "zh-hans": "两周读完四福音书",
    },
    description: {
      en: "Matthew, Mark, Luke, and John — the life of Jesus from four perspectives, in 14 days.",
      web: "Matthew, Mark, Luke, and John — the life of Jesus from four perspectives, in 14 days.",
      "zh-hant": "馬太、馬可、路加、約翰——從四個角度認識耶穌的一生，為期 14 天。",
      "zh-hans": "马太、马可、路加、约翰——从四个角度认识耶稣的一生，为期 14 天。",
    },
    days: distribute(flattenChapters(GOSPEL_IDS), 14),
  },
  {
    id: "psalms-30",
    title: {
      en: "Psalms in 30 Days", web: "Psalms in 30 Days",
      "zh-hant": "30 天讀完詩篇", "zh-hans": "30 天读完诗篇",
    },
    description: {
      en: "All 150 Psalms, about five a day, for a month of prayer and worship.",
      web: "All 150 Psalms, about five a day, for a month of prayer and worship.",
      "zh-hant": "詩篇全書 150 篇，平均每天五篇，一個月的禱告與敬拜。",
      "zh-hans": "诗篇全书 150 篇，平均每天五篇，一个月的祷告与敬拜。",
    },
    days: distribute(flattenChapters(["psa"]), 30),
  },
  {
    id: "proverbs-31",
    title: {
      en: "A Proverb a Day", web: "A Proverb a Day",
      "zh-hant": "每日一箴言", "zh-hans": "每日一箴言",
    },
    description: {
      en: "The classic one-chapter-a-day plan — all 31 chapters of Proverbs, one per day of the month.",
      web: "The classic one-chapter-a-day plan — all 31 chapters of Proverbs, one per day of the month.",
      "zh-hant": "經典的「一天一章」讀經法——箴言全書 31 章，一個月每天一章。",
      "zh-hans": "经典的“一天一章”读经法——箴言全书 31 章，一个月每天一章。",
    },
    days: distribute(flattenChapters(["pro"]), 31),
  },
  {
    id: "bible-90",
    title: {
      en: "The Whole Bible in 90 Days", web: "The Whole Bible in 90 Days",
      "zh-hant": "90 天讀完整本聖經", "zh-hans": "90 天读完整本圣经",
    },
    description: {
      en: "Genesis through Revelation, every chapter of all 66 books, spread across 90 days.",
      web: "Genesis through Revelation, every chapter of all 66 books, spread across 90 days.",
      "zh-hant": "從創世記到啟示錄，66 卷書的每一章，平均分配在 90 天內讀完。",
      "zh-hans": "从创世记到启示录，66 卷书的每一章，平均分配在 90 天内读完。",
    },
    days: distribute(flattenChapters(ALL_IDS), 90),
  },
];
