# Holidaze – Venue Booking Platform

[![CI](https://github.com/johnsulf/project-exam-2/actions/workflows/ci.yml/badge.svg)](https://github.com/johnsulf/project-exam-2/actions/workflows/ci.yml)
[![Pages Deploy](https://github.com/johnsulf/project-exam-2/actions/workflows/pages.yml/badge.svg)](https://github.com/johnsulf/project-exam-2/actions/workflows/pages.yml)

![App preview](public/preview.png)

Holidaze is a modern venue marketplace where travelers can browse and book unique stays while venue managers list and manage their properties.

## Description

The project delivers a responsive, accessible booking experience backed by the Noroff Holidaze API. It aims to streamline planning for guests and empower managers with rich tooling.

- Search for venues with filtering by text, amenities, and availability
- Manage bookings, venue listings, and profile details in dedicated dashboards
- Provide a polished UI with skeleton states, toasts, and a11y-first navigation

## Built With

- React 19 with TypeScript
- Vite 5
- Tailwind CSS v4 and shadcn/ui primitives
- TanStack Query for async state management
- Zustand for lightweight global state
- Zod for schema validation

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)

### Installing

```bash
git clone https://github.com/johnsulf/project-exam-2.git
cd project-exam-2
pnpm install
```

### Running

```bash
pnpm dev
```

Open the printed local URL (typically http://localhost:5173) to explore the app.

## Testing & QA

- `pnpm test:unit` runs Vitest unit and integration suites (use `pnpm test` in CI).
- `pnpm test:e2e` executes Playwright end-to-end coverage (requires the dev server running).
- `pnpm lint` and `pnpm typecheck` keep code quality and typing aligned.
- Manual scenarios live in `docs/qa-checklist.md` for regression reviews.

All automated suites must pass before deploying.

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

## Scripts

| Script           | Description                               |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Start the Vite dev server with HMR        |
| `pnpm build`     | Type-check and build the production bundle|
| `pnpm test`      | Run Vitest in CI mode                     |
| `pnpm test:unit` | Watch mode for unit and integration tests |
| `pnpm test:e2e`  | Execute Playwright E2E tests              |
| `pnpm lint`      | Run ESLint                                |
| `pnpm typecheck` | Run TypeScript without emitting           |

## Features

- Venue search with client-side filtering by text, amenities, and dates
- Mobile bottom-sheet search UI with inline popovers
- Venue detail gallery with smooth transitions
- Auth flows for sign-in, customer, and manager registration
- Owner dashboard for CRUD operations on venues and booking management
- Profile view for bookings, avatar updates, and owner ratings (mock)
- Shared UI built on shadcn/ui and Tailwind utility classes

## Required Project Links

- Gantt Chart: [GitHub Projects](https://github.com/users/johnsulf/projects/7/views/2)
- Design Prototype Desktop: [Figma](https://www.figma.com/proto/yZvqiW2RABCeLQqSNWAuhk/Holidaze---Style-Guide---Prototype?node-id=57-6401&t=2xDY2KzqmgSfusDb-1)
- Design Prototype Mobile: [Figma](https://www.figma.com/proto/yZvqiW2RABCeLQqSNWAuhk/Holidaze---Style-Guide---Prototype?node-id=68-3133&t=CzSYfnTh7sjlGqfT-1)
- Style Guide: [Figma](https://www.figma.com/proto/yZvqiW2RABCeLQqSNWAuhk/Holidaze---Style-Guide---Prototype?node-id=0-1&t=CzSYfnTh7sjlGqfT-1)
- Kanban Board: [GitHub Projects](https://github.com/users/johnsulf/projects/7/views/1)
- Repository: [GitHub](https://github.com/johnsulf/project-exam-2)
- Hosted Demo: [Holidaze](https://johnsulf.github.io/project-exam-2/)

## Project Structure

```text
src/
  components/        # Reusable UI (auth forms, layout, primitives)
  features/          # Domain features (venues, bookings, profile, manager)
  lib/               # API helpers, query keys, utilities
  pages/             # Route-level React components
  providers/         # Global context (auth, app)
  config/            # Runtime configuration
  index.css          # Tailwind layers and motion utilities
```

## Contributing

Contributions are welcome—please open an issue or pull request outlining the change so it can be discussed and reviewed before merging.

## Contact

- GitHub: [@johnsulf](https://github.com/johnsulf)

## License

This project is provided for educational purposes and has no specific license.

## Acknowledgments

- Noroff Holidaze API team for the backend service
- shadcn/ui and the Tailwind community for component foundations
