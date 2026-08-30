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
      // "autoUpdate" makes vite-plugin-pwa's client script silently
      // auto-activate and reload on its own schedule, which completely
      // bypasses onNeedRefresh — the manual "Check for updates" / "Update
      // available" flow in lib/appUpdate.ts would never fire. "prompt" is
      // required for that flow: a new service worker installs and waits,
      // onNeedRefresh fires so Settings can show "Update available," and
      // activation only happens when the reader taps "Update now" (see
      // main.tsx / lib/appUpdate.ts).
      registerType: "prompt",
      // Registered manually in main.tsx via virtual:pwa-register.
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
        // Only the small app shell is precached at install time (~300KB) —
        // deliberately, so the service worker installs fast and reliably
        // even on iOS Safari, which doesn't guarantee an install event can
        // run indefinitely in the background. The full ~30MB of scripture/
        // insights/maps content (all 66 books x 4 versions, all 66 books x
        // 3 insight languages, all 21 maps) is instead downloaded from
        // ordinary page code after the app has booted (see
        // lib/bulkOfflineDownload.ts), in small resumable batches that
        // write into the exact same cache names these runtime-caching
        // rules read from — so a lazy fetch from scripture.ts/insights.ts/
        // maps.ts transparently finds it already cached, same as before.
        // An earlier version tried to precache everything atomically
        // inside the install event and got stuck partway on iOS with no
        // way to resume; this version can pause/resume around backgrounding
        // and retries failed files individually instead of all-or-nothing.
        globPatterns: ["**/*.{js,css,html,woff2,png}"],
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
          {
            // Whole-Bible search index (lib/search.ts, scripts/build-search-
            // index.mjs) — one compact file per version, fetched lazily the
            // first time Search opens rather than precached, same as the
            // scripture/insights/explain rules below.
            urlPattern: /\/search-index\/.*\.json$/,
            handler: "CacheFirst",
            options: {
              cacheName: "bible-search-index",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Second AI-explanation track (lib/explain.ts). Not yet in the
            // bulk offline manifest — only Genesis 1-3 (en/zh-hant) exists
            // so far, and pre-fetching 66 books' worth of 404s would stall
            // the offline-ready progress bar. This rule still lets whatever
            // does exist get cached for offline reuse after a normal visit,
            // same as insights/maps before the bulk downloader existed.
            urlPattern: /\/explain\/.*\.json$/,
            handler: "CacheFirst",
            options: {
              cacheName: "bible-explain",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
