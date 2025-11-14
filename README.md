## Project Exam 2

[![CI](https://github.com/johnsulf/project-exam-2/actions/workflows/ci.yml/badge.svg)](https://github.com/johnsulf/project-exam-2/actions/workflows/ci.yml)
[![Pages Deploy](https://github.com/johnsulf/project-exam-2/actions/workflows/pages.yml/badge.svg)](https://github.com/johnsulf/project-exam-2/actions/workflows/pages.yml)

Holidaze web app – browse venues, create a user to book venues or become a venue manager to create and host your own venues.

![App preview](public/preview.png)

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Environment Variables](#environment-variables)
3. [Quick Start](#quick-start)
4. [Scripts](#scripts)
5. [Testing & QA](#testing--qa)
6. [Features](#features)
7. [Required Project Links](#required-project-links)
8. [Project Structure](#project-structure)

---

## Tech Stack

- React 19 + TypeScript
- Vite 5
- Tailwind CSS v4 with shadcn/ui primitives
- TanStack Query for server-state caching and async data fetching
- Zustand for lightweight global state management
- Zod for runtime schema validation and type inference

---

## Environment Variables

Override defaults with a `.env` file or shell variables:

| Variable            | Default                          | Purpose                                  |
| ------------------- | -------------------------------- | ---------------------------------------- |
| `VITE_API_BASE_URL` | `https://v2.api.noroff.dev`      | Backend base URL (no trailing slash).    |
| `VITE_APP_ENV`      | inferred from Vite mode          | Exposes environment in logs/analytics.   |
| `VITE_DEBUG`        | `true` in dev, `false` otherwise | Enables verbose logging and diagnostics. |

Example `.env.local`:

```bash
VITE_API_BASE_URL=https://v2.api.noroff.dev
VITE_APP_ENV=development
VITE_DEBUG=true
```

---

## Quick Start

**Prerequisites**

- Node.js 20+
- pnpm (`npm i -g pnpm`)

**Setup**

```bash
git clone https://github.com/johnsulf/project-exam-2.git
cd project-exam-2
pnpm install
pnpm dev
```

Open the printed local URL (usually http://localhost:5173).

---

## Scripts

| Script           | Description                               |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Start the Vite dev server with HMR        |
| `pnpm build`     | Type-check and build production bundle    |
| `pnpm test`      | Run Vitest in CI mode                     |
| `pnpm test:unit` | Watch mode for unit and integration tests |
| `pnpm test:e2e`  | Execute Playwright E2E tests              |
| `pnpm lint`      | Run ESLint                                |
| `pnpm typecheck` | Run TypeScript without emitting           |

---

## Testing & QA

- **Unit & integration:** `pnpm test:unit` (Vitest + jsdom). Use `pnpm test` for CI runs.
- **End-to-end:** `pnpm test:e2e` (Playwright). Requires the Vite dev server at `http://localhost:5173`; CI launches it automatically.
- **Linting & types:** `pnpm lint` and `pnpm typecheck` (also wired into CI).
- **Manual QA:** See `docs/qa-checklist.md` for auth, booking, venue management, and regression flows.

Deployment pipelines require all automated test suites to succeed before release.

---

## Features

- Venue search with client-side filtering by text, amenities, and dates
- Mobile bottom-sheet search UI with inline popovers
- Venue detail gallery with smooth transitions
- Auth flows for sign-in, customer, and manager registration
- Owner dashboard for CRUD operations on venues and booking management
- Profile view for bookings, avatar updates, and owner ratings (mock)
- Shared UI built on shadcn/ui and Tailwind utility classes

---

## Required Project Links

- Gantt Chart: [GitHub Projects](https://github.com/users/johnsulf/projects/7/views/2)
- Design Prototype Desktop: [Figma](https://www.figma.com/proto/yZvqiW2RABCeLQqSNWAuhk/Holidaze---Style-Guide---Prototype?node-id=57-6401&t=2xDY2KzqmgSfusDb-1)
- Design Prototype Mobile: [Figma](https://www.figma.com/proto/yZvqiW2RABCeLQqSNWAuhk/Holidaze---Style-Guide---Prototype?node-id=68-3133&t=CzSYfnTh7sjlGqfT-1)
- Style Guide: [Figma](https://www.figma.com/proto/yZvqiW2RABCeLQqSNWAuhk/Holidaze---Style-Guide---Prototype?node-id=0-1&t=CzSYfnTh7sjlGqfT-1)
- Kanban Board: [GitHub Projects](https://github.com/users/johnsulf/projects/7/views/1)
- Repository: [GitHub](https://github.com/johnsulf/project-exam-2)
- Hosted Demo: [Holidaze](https://johnsulf.github.io/project-exam-2/)

---

## Project Structure

```
src/
  components/        # Reusable UI (auth forms, layout, primitives)
  features/          # Domain features (venues, bookings, profile, manager)
  lib/               # API helpers, query keys, utilities
  pages/             # Route-level React components
  providers/         # Global context (auth, app)
  config/            # Runtime configuration
  index.css          # Tailwind layers and motion utilities
```
