# Personal Site — Vortex Theme (multi-page)

Personal website for **Yathukrishnan T.U** built with the Vortex Studio dark theme (`#FF4A1C` accent, Inter + JetBrains Mono), structured as separate pages with a floating pill navbar (Nova-style).

- **Frontend:** React 18 + Vite + React Router (`client/`)
- **Backend:** Node + Express (`server/`) — serves site content and stores contact messages

## Pages

| Route          | Page                                                        |
| -------------- | ----------------------------------------------------------- |
| `/`            | Hero (your photo background) + marquee + expertise preview + CTA |
| `/about`       | Purple "skill-routing" page — masked headline, animated skill network, bio, now-cards |
| `/expertise`   | Cognitive HUD panel — wireframe sphere + discipline columns  |
| `/work`        | AuraCore spatial hero + compact project cards                |
| `/journey`     | Green timeline tree — studies & milestones (old `/experience` redirects) |
| `/contact`     | Contact info + working form                                  |

## Quick start

```bash
npm run install:all   # installs root + server + client dependencies
npm run dev           # run from this root folder! API :4000 + client :5173
```

Open **http://localhost:5173**. (`npm run dev` must be executed from `c:\project\my web`, otherwise the child scripts exit with code 1.)

> The site also renders without the backend running (bundled fallback content), but the contact form needs the API.

## Images

- **Hero background:** `client/public/hero.png` (your portrait, already added). Replace the file to swap it — the dark scrim keeps text readable automatically.
- **Project thumbnails:** `client/public/work-1.jpg` … `work-4.jpg` (cards show placeholders until added).

## Editing content

All copy (name, tagline, services, skills, projects, experience, socials, email) lives in
**`server/data/content.json`**. Keep `client/src/fallbackContent.js` in sync.

> Placeholders to update: `profile.email` and the social URLs.

## API

| Route             | Method | Description                                  |
| ----------------- | ------ | -------------------------------------------- |
| `/api/health`     | GET    | Liveness check                               |
| `/api/content`    | GET    | Full site content                            |
| `/api/profile`    | GET    | Profile only                                 |
| `/api/projects`   | GET    | Project list                                 |
| `/api/experience` | GET    | Experience rows                              |
| `/api/contact`    | POST   | `{ name, email, message }` → saved to `server/data/messages.json` |

## Production build

```bash
npm run build        # builds client into client/dist
npm start            # Express serves the API + built SPA (all routes) on :4000
```
