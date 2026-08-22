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

async function openContentsAndGo(bookCode, chapterNum, label) {
  await page.click(".menu-btn");
  await page.waitForTimeout(300);
  await page.click(".drawer-item:nth-child(3)"); // Home, Contents, Search, Settings
  await page.waitForTimeout(350);
  await page.click(`.book-cell:has-text("${bookCode}")`);
  await page.waitForTimeout(150);
  await page.click(`.chapter-cell >> text="${chapterNum}"`);
  await page.waitForTimeout(400);
  const verseCount = await page.locator(".verse-row").count();
  const firstVerse = await page.locator(".verse-text").first().textContent();
  console.log(`${label}: ${verseCount} verses, v1: "${firstVerse?.slice(0, 70)}..."`);
  await page.screenshot({ path: `/tmp/full-${label.replace(/\s+/g, "_")}.png` });
  return verseCount;
}

// Psalm 117 (shortest chapter, 2 verses) in English
const n1 = await openContentsAndGo("PSA", 117, "psalm117-en");
if (n1 !== 2) errors.push(`Psalm 117 should have 2 verses, got ${n1}`);

// Switch to Simplified Chinese, check Revelation 22 (last chapter of Bible)
await page.click(".lang-pill:has-text('简体')");
await page.waitForTimeout(200);
await openContentsAndGo("REV", 22, "revelation22-zhhans");

// Switch to Traditional Chinese, check John 3
await page.click(".lang-pill:has-text('繁體')");
await page.waitForTimeout(200);
const n2 = await openContentsAndGo("JOH", 3, "john3-zhhant");
if (n2 !== 36) errors.push(`John 3 should have 36 verses, got ${n2}`);

// Every chapter now ships pre-generated AI insights, so a real, non-Genesis-1
// chapter should show its 5 points directly rather than the Generate button.
await page.click(".tab-btn:nth-child(2)"); // Insights tab
await page.waitForTimeout(200);
await page.screenshot({ path: "/tmp/full-john3-insights.png" });
const pointCount = await page.locator(".point-card").count();
if (pointCount !== 3) errors.push(`John 3 should show 3 pre-generated insight points, got ${pointCount}`);

// WEB version, Psalm 23
await page.click(".lang-pill:has-text('WEB')");
await page.waitForTimeout(200);
await openContentsAndGo("PSA", 23, "psalm23-web");

await browser.close();

console.log("console/page errors:", JSON.stringify(errors, null, 2));
console.log(errors.length ? "QA FOUND ERRORS" : "QA CLEAN");
