# Jateen Yadav — Digital Business Card (PWA)

An installable **Progressive Web App** digital business card, styled in the Hitachi corporate identity.
Built for quick, professional networking — scan the QR to connect on LinkedIn, tap to save contact, or install it to your phone's home screen.

**Live demo:** https://jateenyadav.github.io/digital-card/

## Features

- **Installable PWA** — adds to the Android/iOS home screen, opens full-screen, works offline
- **Offline-first** — service worker caches the app shell (including a locally bundled Three.js)
- **Animated 3D background** — Three.js particle field + wireframe icosahedron (Hitachi red on black)
- **Offline QR code** — embedded SVG that opens LinkedIn when scanned
- **One-tap actions** — Connect on LinkedIn, View Portfolio, Save contact (vCard), Email (work/personal), Call, WhatsApp
- **Hitachi theme** — Inspire Red (`#E4002B`) on black, "Inspire the Next" brand bar

## Tech

- Vanilla HTML / CSS / JavaScript (no build step)
- [Three.js](https://threejs.org/) r128 (bundled locally in `assets/`)
- Web App Manifest + Service Worker

## Project structure

```
.
├── index.html               # the PWA card
├── manifest.webmanifest     # app metadata, icons, theme
├── sw.js                    # service worker (offline cache)
├── card.html                # original single-file version (no PWA)
└── assets/
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-512.png
    ├── apple-touch-icon.png
    ├── icon-source.svg      # editable icon source
    └── three.min.js         # bundled for offline use
```

## Run locally

A service worker requires HTTP (not `file://`), so serve it with any static server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploy

Any static host works. Fastest option:

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this folder in
3. Open the HTTPS URL on your phone and install it

## Install on your phone

- **Android / Chrome:** open the deployed URL → "Install app" prompt (or menu → Add to Home screen)
- **iPhone / Safari:** open the URL → Share → "Add to Home Screen"

---

Made by **Jateen Yadav** — Junior Research Engineer, Hitachi India R&D
[LinkedIn](https://www.linkedin.com/in/jateen-yadav/) · [Portfolio](https://jateenyadav.netlify.app)
