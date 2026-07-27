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

// Open Contents.
await page.click(".menu-btn");
await page.waitForTimeout(350);
await page.click("text=目錄");
await page.waitForTimeout(400);

const bodyHandle = await page.$(".modal-body");
const scrollInfo = await bodyHandle.evaluate((el) => ({
  scrollHeight: el.scrollHeight,
  clientHeight: el.clientHeight,
}));
console.log("modal-body scrollHeight/clientHeight:", JSON.stringify(scrollInfo));

const bookRowCount = await page.$$eval(".book-row", (rows) => rows.length);
console.log("book-row count in DOM:", bookRowCount);
const bookCellCount = await page.$$eval(".book-cell", (cells) => cells.length);
console.log("book-cell count in DOM:", bookCellCount);

// Scroll through in steps, screenshotting each, to see how far real content renders.
const steps = 8;
for (let i = 0; i <= steps; i++) {
  const frac = i / steps;
  await bodyHandle.evaluate((el, frac) => {
    el.scrollTop = Math.round((el.scrollHeight - el.clientHeight) * frac);
  }, frac);
  await page.waitForTimeout(150);
  await page.screenshot({ path: `/tmp/qa-zh-scroll-${i}.png` });
}

// Check the last book row's cells actually have visible text/bounding boxes.
const lastRowText = await page.$$eval(".book-row", (rows) => {
  const last = rows[rows.length - 1];
  return last ? Array.from(last.querySelectorAll(".book-cell")).map((c) => c.textContent) : null;
});
console.log("last book-row cell text:", JSON.stringify(lastRowText));

const allCellRects = await page.$$eval(".book-cell", (cells) =>
  cells.map((c) => {
    const r = c.getBoundingClientRect();
    return { text: c.textContent, w: r.width, h: r.height };
  }),
);
const zeroSized = allCellRects.filter((c) => c.w === 0 || c.h === 0);
console.log("total book-cells:", allCellRects.length, "zero-sized cells:", zeroSized.length);
if (zeroSized.length) console.log("sample zero-sized:", JSON.stringify(zeroSized.slice(0, 5)));

await browser.close();
console.log("console/page errors:", JSON.stringify(errors, null, 2));
console.log(errors.length ? "QA FOUND ERRORS" : "QA CLEAN");
