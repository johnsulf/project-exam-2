## Project Exam 2

[![CI](https://github.com/johnsulf/project-exam-2/actions/workflows/ci.yml/badge.svg)](https://github.com/johnsulf/project-exam-2/actions/workflows/ci.yml)
[![Pages Deploy](https://github.com/johnsulf/project-exam-2/actions/workflows/pages.yml/badge.svg)](https://github.com/johnsulf/project-exam-2/actions/workflows/pages.yml)

Holidaze web app – browse venues, manage listings, and handle bookings with an improved search experience, inline availability filtering, and post-stay owner ratings.

Built with:

- React 19 + TypeScript
- Vite 5 (fast dev & bundling)
- Tailwind CSS v4 + shadcn/ui component primitives
- TanStack Query for data fetching & cache
- Zustand for client auth/session state

The project is production-leaning: strongly typed, componentised, and ready for CI/CD. Clone, install, and run in under five minutes.

---

## Quick Start

Prerequisites:

- Node 20+ (LTS recommended)
- pnpm (install globally: `npm i -g pnpm` if needed)

Clone & run:

```bash
git clone <repo-url>
cd project-exam-2
pnpm install
pnpm dev
```

Then open the printed local URL (usually http://localhost:5173).

---

## Scripts

| Script           | Purpose                                     |
| ---------------- | ------------------------------------------- |
| `pnpm dev`       | Start Vite dev server with HMR              |
| `pnpm build`     | Type check then build production bundle     |
| `pnpm test`      | Run Vitest test suite (CI friendly)         |
| `pnpm test:ui`   | Interactive test watcher/UI (if configured) |
| `pnpm lint`      | Run ESLint over source                      |
| `pnpm typecheck` | Run TypeScript without emitting             |

Optional additions you can add later: `pnpm format` (Prettier), `pnpm preview` (serve built assets).

---

## Features

- Venue search with client-side filtering (name, description, and location fields) plus amenity/date filters
- Mobile bottom-sheet search UI, including inline popovers for dates & filters
- Venue detail gallery with smooth image transitions
- Auth flows (sign in, register customer, register manager) with subtle entry animations and spinner feedback
- Owner dashboard for creating, editing, deleting venues, and managing bookings; responsive cards on mobile
- Profile view with past/upcoming bookings, avatar editing, and owner-only rating updates
- Shared UI based on shadcn/ui + Tailwind utility classes

---

## Deployment

Target: GitHub Pages.

Placeholder live URL (update after first deploy):
`https://<username>.github.io/project-exam-2/`

Basic steps (once build + gh-pages workflow configured):

1. Set `base` in `vite.config.ts` to `/project-exam-2/`.
2. Build: `pnpm build`.
3. Publish `dist/` (via GH Action or `gh-pages` branch strategy).

---

## Required Project Links (Placeholders)

- Figma overview: <ADD FIGMA LINK>
- Figma component specs: <ADD FIGMA LINK>
- Figma: <ADD FIGMA LINK>
- Style Guide: <ADD STYLE GUIDE LINK>
- Gantt Chart: <ADD GANTT LINK>
- Kanban Board: <ADD KANBAN (e.g. GitHub Projects / Trello) LINK>
- Repository: <ADD REPO URL>
- Live Demo: <ADD DEPLOYED APP URL>

Keep these updated for examiner & collaborators.

---

## Project Structure (Evolving)

```
src/
  components/        # Reusable UI (incl. auth forms, layout)
  features/          # Domain features (venues, bookings, profile, manager)
  lib/               # API helpers, query keys, utilities
  pages/             # Route-level React components
  providers/         # Global context (auth, theme, router)
  config/            # Runtime configuration
  index.css          # Tailwind layers + motion utilities
```

---

## Verification Checklist (New Contributor <5 min)

- [ ] Cloned repository
- [ ] Ran `pnpm install` without errors
- [ ] `pnpm dev` starts server & homepage renders
- [ ] Tailwind classes apply (inspect element to confirm) _(if initialized)_
- [ ] `pnpm test` passes
- [ ] `pnpm build` produces a `dist/` folder

If any box fails, open an issue titled "Onboarding friction: <short description>".

---

## Roadmap (Initial)

- [ ] Configure Tailwind v4 + base design tokens
- [ ] Add shadcn/ui foundational components
- [ ] Set up API layer (fetch wrapper + error handling)
- [ ] Implement routing (if multi-page / dashboard required)
- [ ] Accessibility & keyboard navigation audit
- [ ] GitHub Pages deploy workflow (CI)

---

## Conventions

- Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`
- Branches: `feature/<name>`, `fix/<issue-id>`, `chore/<task>`
- PRs: concise description + screenshots (UI) + test notes

---

## Known Issues

- `pnpm test` currently fails due to an upstream `jsdom`/`parse5` ESM interop bug (`ERR_REQUIRE_ESM`). Pinning jsdom < 27 or waiting for a patched release resolves the problem – keep an eye on the jsdom changelog.

---

## License

Add license info here if required by assignment guidelines.

---

Update this README continuously as architecture & scope evolve.
