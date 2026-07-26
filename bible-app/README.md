# Inkverse — comic-styled AI Bible reader

**Live:** https://lindsayfolder.github.io/Customer-tracker/ — open on any
phone and use "Add to Home Screen" to install it (see below).

A phone-installable Bible reader: the **complete Bible, all 66 books**, in
four public-domain versions (KJV, WEB, 和合本 Traditional, 和合本
Simplified), 5 AI-drawn main points per chapter with tap-to-deep-dive,
on-device text-to-speech, cross-language search, and an AI-insight cache
that auto-cleans itself so it stays small on a phone.

**What's fully working right now:** the entire Bible is readable, offline,
in all four versions — every book, every chapter, the moment you install
it. Genesis 1 additionally ships with its 5 AI insights pre-written, so
there's one chapter that shows the whole experience (scripture + AI +
listen + search) with zero setup.

**What needs one more step to extend:** AI insights for every chapter
besides Genesis 1. The generation pipeline is fully wired up — it just
needs an AI endpoint configured once (see "Enabling AI generation" below),
after which tapping **Generate 5 points with AI** on any chapter works.

## Run it locally

```bash
npm install
npm run dev
```

Open the printed local URL. The whole Bible is readable immediately, no
configuration needed.

## Build for deployment

```bash
npm run build
```

Output goes to `dist/` — the app shell precaches at ~300 KB (HTML, CSS, JS,
subset comic fonts, icons); the full Bible text is ~17 MB across all 66
books × 4 versions but is **never precached** — each book is fetched only
the first time it's opened and cached by the service worker after that, so
a phone that only ever reads a few books stays at a few hundred KB of
scripture, not 17 MB. Deploy `dist/` to any static host with HTTPS:
[Vercel](https://vercel.com), [Netlify](https://netlify.com), or
[Cloudflare Pages](https://pages.cloudflare.com) all have free tiers that
are more than enough for this.

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

## Enabling AI generation for chapters beyond Genesis 1

The app never calls the Anthropic API directly from the browser — an API
key embedded in client code is visible to anyone who opens devtools. Instead:

1. Deploy `server/generate-insights.js` as a serverless function (it's
   written for Vercel Edge Functions; adapting to Cloudflare Workers is a
   small change). It calls Claude server-side, using an environment
   variable, so the key never reaches the client:
   ```bash
   vercel env add ANTHROPIC_API_KEY   # paste your key
   vercel deploy
   ```
2. In the app's **Settings → AI endpoint**, paste your deployed function's
   URL (e.g. `https://your-app.vercel.app/api/generate-insights`).
3. Open any chapter and tap **Generate 5 points with AI** — the real verse
   text for that chapter is sent to your proxy, and the resulting 5 points
   are cached so it's instant (and free) the next time.

Without steps 1–2, the app still works fully — you just can't generate new
AI insights yet beyond the pre-written Genesis 1. That's deliberate: no
internet dependency for reading the Bible itself.

## Why the AI cache won't balloon in size

Generated insights are cached per chapter+language in IndexedDB with a
**size cap you control in Settings** (20/50/100/200 MB). When you're near
the cap, the least-recently-read chapters are evicted automatically —
favorites are exempt by default. Nothing is deleted while you're offline,
and reopening an evicted chapter just regenerates it in a few seconds. The
text itself is tiny (a few KB per chapter) — even AI insights for the
entire Bible in all four languages would stay well under the cap.

Scripture text is handled separately and even more conservatively: it's
static files fetched lazily per book (see "Build for deployment" above),
so it only ever grows with what's actually been read, never generated or
regenerated.

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

The bundled text was assembled from three public-domain datasets (see each
project for their own licensing details):

- KJV: [aruljohn/Bible-kjv](https://github.com/aruljohn/Bible-kjv)
- WEB: [TehShrike/world-english-bible](https://github.com/TehShrike/world-english-bible)
- 和合本 (Traditional): the `zh/cuv` dataset from
  [MaatheusGois/bible](https://github.com/MaatheusGois/bible)

The 5 AI-insight points for Genesis 1 (in all four languages) are original
commentary written for this app, not sourced from any translation.

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
  lib/           scripture.ts (lazy per-book fetch), db.ts (IndexedDB AI
                 cache + LRU eviction), ai.ts (AI proxy client), tts.ts
                 (speech synthesis)
  context/       app-wide state (language, settings, toast, cache usage)
  components/    Drawer, ContentsModal, SearchModal, SettingsModal, etc.
  App.tsx        screen layout and navigation
public/
  bible/<version>/<bookId>.json   all 66 books × 4 versions, fetched lazily
server/
  generate-insights.js   reference serverless proxy for AI generation
scripts/
  gen-icons.mjs       regenerates public/icons/*.png from the SVG mark
  qa.mjs              Playwright smoke test — Genesis 1 screens
  qa-full-bible.mjs   Playwright smoke test — spot-checks books/chapters
                       across all 66 books and all 4 versions
```
