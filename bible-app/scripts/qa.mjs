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
await page.screenshot({ path: "/tmp/qa-1-home.png" });

// switch to insights tab, open a point, listen (no-op if unsupported), back
await page.click("text=Insights");
await page.screenshot({ path: "/tmp/qa-2-insights.png" });
await page.click(".point-card >> nth=0");
await page.waitForTimeout(450);
await page.screenshot({ path: "/tmp/qa-3-detail.png" });
await page.click("text=Back to chapter");
await page.waitForTimeout(450);

// language switch
await page.click(".lang-pill:has-text('繁體')");
await page.screenshot({ path: "/tmp/qa-4-zhhant.png" });
await page.click(".lang-pill:has-text('KJV')");

// drawer -> contents -> chapter grid
await page.click(".menu-btn");
await page.waitForTimeout(350);
await page.click("text=Contents");
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/qa-5-contents.png" });
await page.click(".chapter-cell >> text='2'"); // whole Bible is real now — this navigates for real
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/qa-6-chapter2.png" });
await page.click(".menu-btn");
await page.waitForTimeout(350);
await page.click("text=Contents");
await page.waitForTimeout(400);
await page.click(".chapter-cell >> text='1'"); // back to chapter 1
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/qa-7-back-home.png" });

// search
await page.click(".menu-btn");
await page.waitForTimeout(350);
await page.click("text=Search");
await page.waitForTimeout(400);
await page.fill(".search-input", "light");
await page.screenshot({ path: "/tmp/qa-8-search.png" });
await page.click(".result-item >> nth=0");
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/qa-9-search-nav.png" });

// settings
await page.click(".menu-btn");
await page.waitForTimeout(350);
await page.click("text=Settings");
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/qa-10-settings.png" });
await page.click(".seg-btn:has-text('Dark')");
await page.screenshot({ path: "/tmp/qa-11-dark.png" });
await page.click(".clear-btn");
await page.waitForTimeout(200);
await page.screenshot({ path: "/tmp/qa-12-cleared-toast.png" });

await browser.close();

console.log("console/page errors:", JSON.stringify(errors, null, 2));
console.log(errors.length ? "QA FOUND ERRORS" : "QA CLEAN");
