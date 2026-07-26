import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "Inkverse — AI Bible Reader",
        short_name: "Inkverse",
        description: "A comic-styled, AI-assisted Bible reader with English and Chinese versions.",
        theme_color: "#c97a12",
        background_color: "#f1e9d8",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
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
