# Inkverse — comic-styled AI Bible reader

A phone-installable Bible reader: scripture in four public-domain versions
(KJV, WEB, 和合本 Traditional, 和合本 Simplified), 5 AI-drawn main points per
chapter with tap-to-deep-dive, on-device text-to-speech, cross-language
search, and a chapter/AI cache that auto-cleans itself so it stays small on
a phone.

**What's fully working right now:** Genesis 1, all four versions, end to
end — scripture, AI insights, search, settings, listen. It's bundled in the
app itself, so it works offline the moment you install it, no setup
required.

**What needs a bit more to extend:** every other book/chapter. The data
model, book/chapter picker, IndexedDB cache, and AI-generation pipeline are
all built and wired up — they just need (1) real verse text added to
`src/data` for a chapter and (2) an AI endpoint configured in Settings to
generate that chapter's 5 points. See "Adding more of the Bible" below.

## Run it locally

```bash
npm install
npm run dev
```

Open the printed local URL. Genesis 1 works immediately with no
configuration.

## Build for deployment

```bash
npm run build
```

Output goes to `dist/` — a fully static PWA (~300 KB precached: HTML, CSS,
JS, subset comic fonts, icons). Deploy `dist/` to any static host with
HTTPS: [Vercel](https://vercel.com), [Netlify](https://netlify.com), or
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
browser bar), works offline for Genesis 1, and needs no App Store, no
Apple Developer account, and no Google Play listing — just the URL. You
can install it on as many phones as you like, including hers, for free.
If you later want it listed in the actual App Store/Play Store, that's a
separate step (wrapping it with something like Capacitor) — not required
for personal installs.

## Adding more of the Bible

1. Add verse text for a chapter to `src/data` (follow the shape in
   `genesis1.ts` — an array of `{ n, t }` per version).
2. Wire it into the book/chapter picker in `ContentsModal.tsx` (currently
   only Genesis 1 is marked as available; that's intentional — the app
   never pretends to have text it doesn't).
3. Deploy the AI proxy (next section) and open that chapter in the app —
   the "Generate 5 points with AI" button will call it and cache the
   result.

## Enabling AI generation for new chapters

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
3. Open any chapter that has verse text but no cached insights yet, and
   tap **Generate 5 points with AI**.

Without step 1–2, the app still works fully for Genesis 1 (bundled) — you
just can't generate new chapters yet. That's deliberate: no internet
dependency for the core experience.

## Why the AI cache won't balloon in size

Generated insights are cached per chapter+language in IndexedDB with a
**size cap you control in Settings** (20/50/100/200 MB). When you're near
the cap, the least-recently-read chapters are evicted automatically —
favorites are exempt by default. Nothing is deleted while you're offline,
and reopening an evicted chapter just regenerates it in a few seconds. The
text itself is tiny (a few KB per chapter) — even reading the whole Bible
in all four versions stays well under the cap.

## Translation licensing notes

- **KJV** and **World English Bible (WEB)**: public domain, free to bundle
  and distribute without permission.
- **和合本 (Chinese Union Version)**, Traditional & Simplified: public
  domain (published 1919), same as KJV.
- **NASB** was considered but is **not** public domain — it's copyrighted
  by The Lockman Foundation and requires their written permission for
  full-text use in an app (see their [Permission to Quote
  form](https://www.lockman.org/permission-to-quote-request-form/)).
  Swapping it in later is a small data change in `src/data`, not a
  rearchitecture — the version picker already supports adding it.

## Adding text-to-speech voices

Listen uses the device/browser's built-in `speechSynthesis` — free, works
offline, no API calls, no bundled audio. Voice quality and availability
depend on the phone's OS voice packs (iOS and Android both ship English
and Chinese voices by default). See `src/lib/tts.ts`.

## Project structure

```
src/
  data/          book list, language/UI strings, Genesis 1 seed content
  lib/           db.ts (IndexedDB cache + LRU eviction), ai.ts (AI proxy
                 client), tts.ts (speech synthesis)
  context/       app-wide state (language, settings, toast, cache usage)
  components/    Drawer, ContentsModal, SearchModal, SettingsModal, etc.
  App.tsx        screen layout and navigation
server/
  generate-insights.js   reference serverless proxy for AI generation
scripts/
  gen-icons.mjs  regenerates public/icons/*.png from the SVG mark
  qa.mjs         Playwright smoke test — screenshots every major screen
                 and flags any console/page errors
```
