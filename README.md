# DAN SANDS // signal

> **a personal site that refuses to be a personal site.**

Let's be honest about this — it's a single landing page. It could have been
a `div` and a `p` and we could all go home. But I have a design background, and
I physically could not allow this to be *just a website*. So instead of shipping
something sane, I built a tiny, opinionated playground: a privacy-first,
tracker-free, no-cookie landing page wrapped in a boot sequence, HUD corners, a
typing rotor, and **seven** full-screen canvas themes you can flip between like a
swatch book.

This repo is **exploration**, not production. Phase 01 of many. The point was
never to finish a resume site — it was to see how far a hero section can be
pushed before it becomes a mood. Spoiler: pretty far.

---

## What it is

A bilingual (EN / ES) personal-signal page for **Dan Sands** — product-oriented
technology leader (Product Operations / AI workflow transformation). It renders
zero third-party scripts, zero trackers, zero cookies. Everything is local,
static, and served as plain files.

- **Boot sequence** — a faux "initializing signal…" terminal that fades into the stage.
- **HUD frame** — live UTC clock, status ticks, location tag. Pure chrome, pure vibe.
- **Hero** — ASCII "crest" (one per theme), glitch-on-hover title, tagline, and a
  typewriter subline that rotates through who-I-am phrases.
- **Theme switcher** — seven palettes, persisted to `localStorage`.
- **Language switcher** — EN / ES, persisted, instantly re-renders all copy + rotor.
- **Contact modal** — obfuscated email (assembled in JS, revealed on click + copy),
  LinkedIn, GitHub. No scrapers get a free email address.

---

## Tech stack

Deliberately boring on purpose so the weird stuff stays the star.

| Layer | Choice | Notes |
|-------|--------|-------|
| Markup | Plain `index.html` | No framework. No build step. No bundler. |
| Styles | Vanilla CSS + CSS custom properties | All theming is just `--vars` swapped on `[data-theme]`. |
| Fonts | Space Grotesk · JetBrains Mono · Cinzel (Google Fonts) | Loaded via `<link>`; no JS font loader. |
| Animation | Canvas 2D (`requestAnimationFrame`) | One shared loop, one canvas, per-theme renderers. |
| State | `window.DSS` global + `localStorage` | Theme + language persisted client-side only. |
| i18n | `data-i18n` attributes + `DSS.content.I18N` | Two languages, fully keyed. |
| Tooling | Python 3 (`scripts/ascii_crest.py`) | **Dev-only.** Generates the ASCII crest `.txt` files. Not shipped. |

No dependencies. No npm. No Node at runtime. Open `index.html` (or serve it) and
it just runs.

---

## Project layout

```
dan-sands-site/
├── index.html              # the whole page (markup, structure, script order)
├── css/
│   ├── base.css            # theme-independent layout, HUD, modal, selectors, motion
│   └── themes/             # one palette file per theme (sets [data-theme] vars)
│       ├── sunset.css      ├── forge.css     ├── dawn.css
│       ├── sahira.css      ├── mist.css      ├── starfield.css
│       └── aurelius.css
├── js/
│   ├── content.js          # i18n strings, theme copy, per-theme ASCII crests (inline + .txt)
│   ├── shared.js           # runtime: boot, loop, i18n, selectors, modal, sparks
│   └── themes/             # one canvas animation per theme (registers on DSS.THEMES)
│       ├── sunset.js  ├── forge.js   ├── dawn.js   ├── sahira.js
│       ├── mist.js   ├── starfield.js  ├── aurelius.js
├── assets/crest-src/       # shaded 3D source PNGs for the crests (dev-only)
└── scripts/
    └── ascii_crest.py      # image → ASCII generator (DEV ONLY — not part of the site)
```

> **Note:** `css/themes/*.txt` (the ASCII crests rendered in the hero) are the
> *output* of `scripts/ascii_crest.py`. They are intentionally **not** documented
> inline — they're generated art assets, not hand-maintained source.

---

## Themes & animations

Every theme is two files: a **palette** (`css/themes/<name>.css`, just CSS vars)
and an **animation** (`js/themes/<name>.js`, a `seed()` + `draw()` pair registered
on `DSS.THEMES`). The shared runtime swaps the active renderer when you pick a
swatch. Same canvas, same loop — only the paint changes.

| Theme | Palette | Background animation | Vibe |
|-------|---------|----------------------|------|
| **sunset** *(default)* | techy orange ⇄ cyan | Constellation network — drifting nodes that connect when close; parallax on mouse | cyberpunk dusk |
| **forge** | fire: orange · red · yellow | Rising ember fountain + floating wisps (additive blend) | blacksmith's hearth |
| **dawn** | warm cream · coffee · rose · sky *(light)* | Soft drifting watercolor motes (source-over so they read on a light bg) | calm morning |
| **sahira** | white · brown · copper *(light)* | Soft watercolor blooms in copper/amber/brown | persian warmth |
| **mist** | forest green · light blue · wood *(dark)* | Top-down ASCII forest + a gentle procedural river + drifting fog | misty forest |
| **starfield** *(Ad Astra)* | deep space · white stars · rocket orange | Parallax stars + constellation lines + launching rockets + shooting stars | ad astra |
| **aurelius** | black · gold · silver | Slow "chapters being written" — sentences drift down like rain; a unique black+gold bust crest | classical, editorial |

Light themes (`dawn`, `sahira`) carry extra surface overrides in their CSS so the
modal, swatch tooltips, title gradient, and footer stay legible on a pale ground.

All motion respects `prefers-reduced-motion`: the canvas, grain, and scanlines
drop out and the boot sequence short-circuits straight to the stage.

---

## Privacy posture

- No third-party scripts. No analytics. No cookies. No trackers.
- The contact email is split into parts and assembled at runtime, surfaced only on
  click (copy-to-clipboard). It never sits in the HTML source for scrapers.
- Theme + language are stored in `localStorage` only — nothing leaves the browser.

---

## Run it

No build. Just serve the folder (or open `index.html` directly):

```sh
python3 -m http.server 4321
# → http://localhost:4321
```

The `fetch()` of the crest `.txt` files needs an HTTP origin, so prefer the
local server over `file://`.

---

## Dev-only: regenerating crests

`scripts/ascii_crest.py` converts a shaded 3D source PNG into an ASCII crest
`css/themes/<name>.txt`. It runs under a project venv:

```sh
env -u PYTHONPATH .venv/bin/python scripts/ascii_crest.py \
    assets/crest-src/aurelius.png --name aurelius
```

Source art is deliberately **shaded 3D** (real depth/volumes/shadows) — flat
silhouettes get rejected. Backgrounds must be pure black. This script is a
generation tool; it is not loaded by the site.

---

## Status

`WIP — phase 01 of many.` The page is a proof of feel, not a finished product.
Treat every theme, animation, and copy string as a candidate for the next
iteration. Exploration over completion.
