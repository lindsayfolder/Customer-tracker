import { chromium } from "playwright";
import { mkdirSync } from "fs";

const svg = (pad) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="512" height="512">
  <rect width="40" height="40" fill="#c97a12" rx="${pad}"/>
  <path d="M11 14c3-2 6-2 9 0v13c-3-2-6-2-9 0V14z" fill="#fbf6ea" stroke="#1c1a17" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M29 14c-3-2-6-2-9 0v13c3-2 6-2 9 0V14z" fill="#fbf6ea" stroke="#1c1a17" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M20 14v13" stroke="#1c1a17" stroke-width="1.6"/>
</svg>`;

mkdirSync("public/icons", { recursive: true });

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 512, height: 512 } });

async function render(markup, file) {
  await page.setContent(`<body style="margin:0">${markup}</body>`);
  await page.screenshot({ path: file, omitBackground: true });
}

await render(svg(0), "public/icons/icon-512.png");
await page.setViewportSize({ width: 192, height: 192 });
await page.setContent(`<body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="192" height="192">
  <rect width="40" height="40" fill="#c97a12"/>
  <path d="M11 14c3-2 6-2 9 0v13c-3-2-6-2-9 0V14z" fill="#fbf6ea" stroke="#1c1a17" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M29 14c-3-2-6-2-9 0v13c3-2 6-2 9 0V14z" fill="#fbf6ea" stroke="#1c1a17" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M20 14v13" stroke="#1c1a17" stroke-width="1.6"/>
</svg></body>`);
await page.screenshot({ path: "public/icons/icon-192.png" });

// maskable: bigger safe-zone padding (icon content inset within a full-bleed circle)
await page.setViewportSize({ width: 512, height: 512 });
await page.setContent(`<body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="512" height="512">
  <rect width="40" height="40" fill="#c97a12"/>
  <g transform="translate(20 20) scale(0.7) translate(-20 -20)">
    <path d="M11 14c3-2 6-2 9 0v13c-3-2-6-2-9 0V14z" fill="#fbf6ea" stroke="#1c1a17" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M29 14c-3-2-6-2-9 0v13c3-2 6-2 9 0V14z" fill="#fbf6ea" stroke="#1c1a17" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M20 14v13" stroke="#1c1a17" stroke-width="1.6"/>
  </g>
</svg></body>`);
await page.screenshot({ path: "public/icons/icon-maskable-512.png" });

await browser.close();
console.log("icons generated");
