# Inkverse — comic-styled AI Bible reader

**Live:** https://lindsayfolder.github.io/Customer-tracker/ — open on any
phone and use "Add to Home Screen" to install it (see below).

A phone-installable Bible reader: the **complete Bible, all 66 books**, in
four public-domain versions (KJV, WEB, 和合本 Traditional, 和合本
Simplified), 5 AI-drawn main points per chapter with tap-to-deep-dive,
on-device text-to-speech, cross-language search, and Previous/Next chapter
navigation.

**Everything works fully offline, with zero setup and no API key:** the
entire Bible — every book, every chapter, every one of the four
versions — plus all 5-point AI Deep Dive insights for all 1,189 chapters,
in English and both Traditional and Simplified Chinese, ships pre-written
and bundled in the app. There's no "Generate" step and nothing to
configure; install it and it all just works, including for someone who
doesn't have an AI account of their own.

## Run it locally

```bash
npm install
npm run dev
```

Open the printed local URL. The whole Bible — scripture and AI insights —
is readable immediately, no configuration needed.

## Build for deployment

```bash
npm run build
```

Output goes to `dist/` — the app shell precaches at ~300 KB (HTML, CSS, JS,
subset comic fonts, icons); scripture text (~17 MB across all 66 books × 4
versions) and AI insights (~14 MB across all 66 books × 3 languages) are
**never precached** — each book/language is fetched only the first time
it's opened and cached by the service worker after that, so a phone that
only ever reads a few books stays at a few hundred KB, not the full ~31 MB.
Deploy `dist/` to any static host with HTTPS: [Vercel](https://vercel.com),
[Netlify](https://netlify.com), or [Cloudflare
Pages](https://pages.cloudflare.com) all have free tiers that are more than
enough for this.

## Installing it on a phone (yes — your daughter's too)

This is a PWA (Progressive Web App), not an app-store app. Once it's
deployed to any HTTPS URL:

- **iPhone (Safari):** open the URL → tap the Share icon → **Add to Home
  Screen**.
- **Android (Chrome):** open the URL → tap the **⋮** menu → **Install app**
  (or "Add to Home Screen").

Either way it installs a real app icon that launches full-screen (no
browser bar) and needs no App Store, no Apple Developer account, and no
Google Play listing — just the URL. You can install it on as many phones
as you like, including hers, for free. If you later want it listed in the
actual App Store/Play Store, that's a separate step (wrapping it with
something like Capacitor) — not required for personal installs.

## Translation licensing notes

- **KJV** and **World English Bible (WEB)**: public domain, free to bundle
  and distribute without permission.
- **和合本 (Chinese Union Version)**, Traditional & Simplified: public
  domain (published 1919), same as KJV. The Simplified text is derived
  from the Traditional original via OpenCC, the standard tool for this
  conversion (matching how most digital Simplified 和合本 editions are
  produced).
- **NASB** was considered but is **not** public domain — it's copyrighted
  by The Lockman Foundation and requires their written permission for
  full-text use in an app (see their [Permission to Quote
  form](https://www.lockman.org/permission-to-quote-request-form/)).
  Swapping it in later is a small data change, not a rearchitecture — the
  version picker already supports adding a 5th version.

### Source data

The bundled scripture text was assembled from three public-domain datasets
(see each project for their own licensing details):

- KJV: [aruljohn/Bible-kjv](https://github.com/aruljohn/Bible-kjv)
- WEB: [TehShrike/world-english-bible](https://github.com/TehShrike/world-english-bible)
- 和合本 (Traditional): the `zh/cuv` dataset from
  [MaatheusGois/bible](https://github.com/MaatheusGois/bible)

The 5 AI-insight points for every chapter (English and Traditional
Chinese; Simplified Chinese is mechanically derived from Traditional via
OpenCC, same as the scripture text) are original commentary written for
this app, not sourced from any translation.

## Adding text-to-speech voices

Listen uses the device/browser's built-in `speechSynthesis` — free, works
offline, no API calls, no bundled audio. Voice quality and availability
depend on the phone's OS voice packs (iOS and Android both ship English
and Chinese voices by default). See `src/lib/tts.ts`.

## Project structure

```
src/
  data/          book list (all 66), language/UI strings, Genesis 1 seed
                 insights
  lib/           scripture.ts (lazy per-book fetch), insights.ts (lazy
                 per-book AI insights fetch), db.ts (font/theme/language
                 settings persistence), tts.ts (speech synthesis)
  context/       app-wide state (language, settings, toast)
  components/    Drawer, ContentsModal, SearchModal, SettingsModal, etc.
  App.tsx        screen layout and navigation
public/
  bible/<version>/<bookId>.json     all 66 books × 4 versions, fetched lazily
  insights/<lang>/<bookId>.json     all 66 books × 3 languages of AI Deep
                                     Dive insights, fetched lazily
scripts/
  gen-icons.mjs        regenerates public/icons/*.png from the SVG mark
  zh-hans-convert.py   derives public/insights/zh-hans from zh-hant via OpenCC
  qa.mjs               Playwright smoke test — Genesis 1 screens
  qa-full-bible.mjs    Playwright smoke test — spot-checks books/chapters
                        across all 66 books and all 4 versions
  qa-contents-zh.mjs   Playwright smoke test — Contents grid in Chinese
```
