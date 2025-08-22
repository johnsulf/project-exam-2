## Project Exam 2

[![CI](https://github.com/johnsulf/project-exam-2/actions/workflows/ci.yml/badge.svg)](https://github.com/johnsulf/project-exam-2/actions/workflows/ci.yml)
[![Pages Deploy](https://github.com/johnsulf/project-exam-2/actions/workflows/pages.yml/badge.svg)](https://github.com/johnsulf/project-exam-2/actions/workflows/pages.yml)

Modern front‑end application scaffold using:

- React (with TypeScript)
- Vite (fast dev + build)
- Tailwind CSS v4 (utility-first styling)
- shadcn/ui (accessible component primitives on top of Tailwind)

The goal: a production‑ready, strongly typed, testable app with minimal startup friction. A newcomer should be able to clone, install, and run locally in under 5 minutes.

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

If Tailwind or shadcn/ui not yet initialized, follow the notes below.

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

## Stack Details

### React + TypeScript

Strong typing, hooks, and modern JSX runtime.

### Vite

Ultra fast dev server, optimized production build, first‑class TS + JSX support.

### Tailwind CSS v4

Utility classes for rapid UI building. v4 introduces simplified config & layering.

Initialization (if not already done):

```bash
pnpm dlx tailwindcss init -p
```

Add Tailwind directives in your global stylesheet and ensure the `content` array includes `src/**/*.{ts,tsx,html}`.

### shadcn/ui

Composable, accessible components (Radix + Tailwind). Initialize:

```bash
pnpm dlx shadcn-ui@latest init
```

Add components as needed:

```bash
pnpm dlx shadcn-ui@latest add button card dialog
```

---

## Testing

Vitest + @testing-library/react + jsdom for DOM-centric unit tests.
Example smoke test lives in `src/` (expand with component tests + hooks tests).

Run tests:

```bash
pnpm test
```

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
  components/        # Reusable UI pieces (may include shadcn/ui wrappers)
  modules/           # Feature / domain modules
  hooks/             # Shared React hooks
  lib/               # Utilities, API clients, config
  styles/            # Global & design tokens
  tests/ (optional)  # Additional test organization
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

## License

Add license info here if required by assignment guidelines.

---

Update this README continuously as architecture & scope evolve.
