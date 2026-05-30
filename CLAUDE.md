# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Bizet Rodriguez (robotics, 3D printing, AI builds) with cyberpunk-noir aesthetic, hosted on GitHub Pages. Single home page plus three "build detail" pages. No framework, no build step — pure HTML/CSS/vanilla JavaScript.

## Architecture

**Pages:**
- `index.html` — Home page: hero (scroll-scrubbed character video), selected-work grid, terminal about section, skills toolkit, build log, contact
- `project.html` — Detail: Self-driving vehicle
- `project-pokeball.html` — Detail: Poké ball collection  
- `project-porsche.html` — Detail: RC Porsche 911 GT3 RS

**Core files (in `site/` directory):**
- `site.css` — Global design system + home layout (colors, typography, spacing)
- `project.css` — Detail-page layout
- `site.js` — All interactivity (hero reel, video scrub, scroll reveals, terminal typing, Konami code)
- `image-slot.js` — Custom element for images (read-only in production; safe to replace with plain `<img>`)
- `img/` — 9 build photos
- `hero-character.webm/.mp4/.png` — Hero video + posters

**Design System (CSS variables in `site.css :root`):**
- **Colors**: backgrounds (`--bg`, `--bg-2`), panels (`--panel`, `--panel-2`), text (`--text`, `--muted`, `--faint`), accent (`--accent` default violet `#9b6bff`), lines, glows
- **Typography**: `--display` (Oswald), `--ui` (Space Grotesk), `--mono` (JetBrains Mono)
- **Layout**: max-width `1280px`, responsive gutter `clamp(20px, 5vw, 64px)`

## Development

Open `index.html` in a browser to view. Static site, no build step — edit files and reload.

**Key Interactions (in `site.js`):**
- **Hero reel**: auto-cycles 4 headline variants every 6500ms; dots/arrows/←→ keys control it
- **Scroll-scrubbed video**: hero video `currentTime` maps to scroll position (smooth eased)
- **Terminal typing**: "About" section types out text on scroll-into-view (~11ms per char)
- **Scroll reveals**: `.reveal` elements fade in via IntersectionObserver with staggered delays
- **Active nav**: Section highlighting based on scroll position
- **Mobile menu**: Hamburger toggle
- **Konami code**: ↑↑↓↓←→←→BA triggers `body.rampage` (hue-rotate animation)

**Image assets:** All in `site/img/`. Fonts are from Google Fonts (loaded via `<link>`) — need network access.

## Customization Notes

- To change accent color, modify `window.__TWEAKS.accent` in each HTML file or edit `--accent` CSS variable
- The "Tweaks" panel (off-canvas, only visible in authoring tool) is safe to delete; applied defaults live in `window.__TWEAKS`
- `<image-slot>` custom element is read-only in production; can replace with `<img src="…" style="object-fit:cover">`
- If `fetch('.image-slots.state.json')` 404s on load, it's expected (silently caught)

## GitHub Pages Deployment

Push to master to go live at `https://biznitz95.github.io/`. Site is dependency-free and static.
