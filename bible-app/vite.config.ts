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
        // Only the app shell is precached (~300KB). Scripture JSON under
        // /bible/** is deliberately NOT globbed here — it's fetched lazily
        // per book as the user actually reads (see lib/scripture.ts) and
        // persisted for offline use by the runtime-caching rule below, so
        // storage only grows with what's actually been read.
        globPatterns: ["**/*.{js,css,html,woff2,png,svg}"],
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
        ],
      },
    }),
  ],
});
