# Cycle Care

A private, offline period tracker for you and your daughters — built as an installable web app (PWA), so it lives on your phone's home screen like a normal app, with no account, no server, and no data ever leaving the device.

The app lives in [`docs/`](docs/).

## Features

- **Multiple people**: track yourself and each daughter as a separate profile (name, age, relation).
- **Manual logging**: you log each period's start date (and optionally end date, flow, and notes) — nothing is guessed or auto-detected.
- **Predictions**: once at least two periods are logged for a person, the app calculates their average cycle length and shows a predicted next period date and countdown.
- **Works fully offline**: all data is stored in the browser's local storage on that device. There is no backend, no account, and no internet connection required after the first load.
- **Share**: a "Share" button on each person's page builds a short text summary (last period, average cycle, predicted next date) and opens your phone's normal share sheet — so you can send it via Messages, WhatsApp, email, or any app you already have installed. There's also a direct "Text message" and "Email" button, and a "Copy text" fallback.
- **Installable**: works like a real app icon on the home screen (see below).

## Installing on a phone

The app needs to be served over HTTPS for "Add to Home Screen" and offline mode to work (this is a browser requirement, not specific to this app). The easiest way is GitHub Pages:

1. In this repository's GitHub settings, go to **Settings → Pages**.
2. Under "Build and deployment", set **Source** to "Deploy from a branch".
3. Choose the `main` branch and the **`/docs`** folder, then save.
4. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

Once it's live, open that link on your phone:

- **iPhone/iPad (Safari)**: tap the Share icon → "Add to Home Screen" → Add.
- **Android (Chrome)**: tap the ⋮ menu → "Install app" (or "Add to Home screen").

The app itself also shows a "How?" banner with these same steps built in.

Send the same link to your daughter's phone so she can install her own copy. Each installed copy keeps its own private data — this app doesn't sync between devices, so if you're logging on her behalf from your phone, that data stays on your phone unless you use Share to send her a summary.

## Privacy

- No accounts, no analytics, no external servers.
- All entries are stored locally via `localStorage` on the device the app is installed on.
- Data only ever leaves the device when you explicitly tap **Share**.
- Deleting a person also deletes all of their logged periods.

## Local development

No build step is required. To preview locally:

```bash
cd docs
python3 -m http.server 8000
```

Then open `http://localhost:8000`. (Service worker/offline behavior only activates over `localhost` or HTTPS, which both satisfy the browser's secure-context requirement.)
