import { chromium } from "playwright";

const errors = [];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push("pageerror: " + err.message));

await page.goto("http://localhost:4321/", { waitUntil: "networkidle" });
await page.waitForSelector(".app-shell");

// Switch to Traditional Chinese first, matching the user's repro steps.
await page.click(".lang-pill:has-text('繁體')");
await page.waitForTimeout(200);

// Open Contents — two-step now: book grid first, chapter grid after tapping a book.
await page.click(".menu-btn");
await page.waitForTimeout(350);
await page.click("text=目錄");
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/qa-zh-1-books.png" });

const bookCellCount = await page.$$eval(".book-cell", (cells) => cells.length);
console.log("book-cell count in DOM (book step):", bookCellCount);
const bookRowCount = await page.$$eval(".book-row", (rows) => rows.length);
console.log("book-row count in DOM:", bookRowCount);

const allCellRects = await page.$$eval(".book-cell", (cells) =>
  cells.map((c) => {
    const r = c.getBoundingClientRect();
    return { text: c.textContent, w: r.width, h: r.height };
  }),
);
const zeroSized = allCellRects.filter((c) => c.w === 0 || c.h === 0);
console.log("total book-cells:", allCellRects.length, "zero-sized cells:", zeroSized.length);
if (zeroSized.length) console.log("sample zero-sized:", JSON.stringify(zeroSized.slice(0, 5)));

// Scroll the book grid to bottom and confirm the last row (Jude/Revelation) is intact.
const bodyHandle = await page.$(".modal-body");
await bodyHandle.evaluate((el) => {
  el.scrollTop = el.scrollHeight - el.clientHeight;
});
await page.waitForTimeout(150);
await page.screenshot({ path: "/tmp/qa-zh-2-books-bottom.png" });
const lastRowText = await page.$$eval(".book-row", (rows) => {
  const last = rows[rows.length - 1];
  return last ? Array.from(last.querySelectorAll(".book-cell")).map((c) => c.textContent) : null;
});
console.log("last book-row cell text:", JSON.stringify(lastRowText));

// Tap the last book (Revelation, 啟) and confirm its chapter grid (22 chapters) renders.
await page.click(".book-cell:has-text('啟')");
await page.waitForTimeout(300);
await page.screenshot({ path: "/tmp/qa-zh-3-chapters.png" });
const chapterCellCount = await page.$$eval(".chapter-cell", (cells) => cells.length);
console.log("chapter-cell count for Revelation (expect 22):", chapterCellCount);

// Back to the book grid.
await page.click(".back-tab");
await page.waitForTimeout(300);
await page.screenshot({ path: "/tmp/qa-zh-4-back-to-books.png" });
const backToBooks = await page.$$eval(".book-cell", (cells) => cells.length);
console.log("book-cell count after back (expect 66):", backToBooks);

await browser.close();
console.log("console/page errors:", JSON.stringify(errors, null, 2));
console.log(errors.length ? "QA FOUND ERRORS" : "QA CLEAN");
