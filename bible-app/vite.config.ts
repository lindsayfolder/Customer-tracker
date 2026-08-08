import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// GitHub Pages serves project sites from a /<repo-name>/ subpath, not root.
// Set DEPLOY_BASE=/Customer-tracker/ when building for that target; leave
// unset (defaults to "/") for Vercel/Netlify/Cloudflare Pages or local use,
// where the app is served from the domain root.
const BASE = process.env.DEPLOY_BASE || "/";

// https://vite.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // Registered manually in main.tsx via virtual:pwa-register, so a
      // detected update forces an immediate reload instead of silently
      // waiting for a future navigation (which was leaving devices running
      // a stale mix of old/new hashed assets across rapid deploys).
      injectRegister: false,
      includeAssets: ["icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "Inkverse — AI Bible Reader",
        short_name: "Inkverse",
        description: "A comic-styled, AI-assisted Bible reader with English and Chinese versions.",
        theme_color: "#c97a12",
        background_color: "#f1e9d8",
        display: "standalone",
        orientation: "portrait",
        start_url: BASE,
        scope: BASE,
        icons: [
          { src: `${BASE}icons/icon-192.png`, sizes: "192x192", type: "image/png" },
          { src: `${BASE}icons/icon-512.png`, sizes: "512x512", type: "image/png" },
          { src: `${BASE}icons/icon-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Everything is precached during install — app shell, all 66 books
        // of scripture in all 4 versions, all 66 books of AI insights in
        // all 3 languages, and all 21 book maps (~31 MB total, largest
        // single file ~480 KB, well under Workbox's 2 MB per-file cache
        // limit). That's a deliberate choice: this app is meant to be
        // installed once and then read with zero network dependency ever
        // again, including for a book/chapter/version combination the
        // reader has never opened before — not just for content already
        // visited. The one-time install download is the cost of that.
        globPatterns: ["**/*.{js,css,html,woff2,png,json,svg}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /\/bible\/.*\.json$/,
            handler: "CacheFirst",
            options: {
              cacheName: "bible-text",
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\/insights\/.*\.json$/,
            handler: "CacheFirst",
            options: {
              cacheName: "bible-insights",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\/maps\/.*\.svg$/,
            handler: "CacheFirst",
            options: {
              cacheName: "bible-maps",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
