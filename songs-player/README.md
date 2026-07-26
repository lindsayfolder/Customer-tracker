# K-Pop Mix Player

A small installable web app for playing your own song list — no build step, no server, just static files.

## What it does

- Comes preloaded with your SM / YG / JYP hit-song list, grouped by label.
- Tap a track to bring it on stage. If it isn't linked to YouTube yet, the player shows a "Search YouTube ↗" button plus a field to paste the link — paste once and it's saved on your phone for next time.
- Once linked, tracks play through the real YouTube player (official embed), with play/pause, next/previous, shuffle, and repeat (all / one).
- "+ Add track" lets you add new songs (title, artist, playlist, optional YouTube link) any time.
- Everything is stored in your browser's local storage — it's private to your device and needs no account or backend.

## Installing it on your phone

1. Host `songs-player/` somewhere reachable over HTTPS (e.g. enable GitHub Pages for this repo, "Deploy from a branch" → this branch → `/songs-player` — or `/` if you move these files to the repo root).
2. Open the page on your phone in Safari (iOS) or Chrome (Android).
3. Tap the browser's Share/menu button → **Add to Home Screen**.
4. It launches full-screen with its own icon, like a regular app.

## Files

- `index.html` — the whole app (markup, styles, logic).
- `manifest.json` — makes it installable (name, icon, standalone display mode).
- `sw.js` — tiny service worker that caches the app shell so it opens instantly even offline (song playback itself still needs an internet connection, since it streams from YouTube).
- `icon.svg` — home screen icon.

## Notes

- Video playback uses YouTube's own embedded player (no audio/video files are stored or redistributed by this app) — that's why each track needs to be linked to its official YouTube video before it will play.
- Add as many playlists/groups as you like from the "Playlist" field in the add form — they show up as new sections in your library automatically.
