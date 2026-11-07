# Folix PDF Viewer

A lightweight, private, in-browser PDF viewer. A FloppersBlop product.

## Structure
```
index.html      viewer app
app.js          viewer logic (+ fills config values on all pages)
config.js       site settings: name, email, version, zoom limits
styles.css      all styling
about.html  faq.html  contact.html
privacy.html  terms.html  disclaimer.html  copyright.html
sw.js            service worker (offline + share target); generated list of files
lib/            bundled pdf.js, pdf-lib and licences (no CDN needed)
assets/         fonts/, icon.png, branding.png, favicon-32.png, apple-touch-icon.png,
                icon-192.png, icon-512.png, icons/*.svg (UI icons)
site.webmanifest  install-to-home-screen info
```

## Features
Password-protected PDFs, page thumbnails + outline sidebar, continuous scroll with lazy page rendering, zoom / fit / pinch, text selection, search (Ctrl+F), fit width / fit height, rotate, dark reading mode, fullscreen, pinned or auto-hide top bar, download, print, drag-and-drop, `?file=<url>` (needs CORS).

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server`.

## Deploy
GitHub repo -> Settings -> Pages -> branch `main`, folder `/ (root)`.

## Before publishing
Set your real email in `config.js`.

## Credits
PDF.js (Mozilla), Apache-2.0.

## Install, offline and PDF handling
- `site.webmanifest` declares file handling (Open with, Chrome/Edge desktop) and a share target (Android Share menu).
- `sw.js` caches the whole app after the first visit. If you add or rename files, add them to `ASSETS` in `sw.js` and change `CACHE`'s version so users get the update.
- Requires HTTPS (GitHub Pages provides it). Relative paths work under a repo sub-folder.
