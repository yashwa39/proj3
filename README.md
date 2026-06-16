# CarbonMirror (Next.js 15)

Production-ready refactor of the original static CarbonMirror landing app into **Next.js 15 (App Router)** with **TypeScript (strict)**, **Tailwind CSS**, **shadcn-style UI primitives**, **React Hook Form + Zod**, **Zustand**, **Vitest + React Testing Library**, and **Playwright**.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Scripts

- **dev**: `npm run dev`
- **build**: `npm run build`
- **start**: `npm run start`
- **lint**: `npm run lint`
- **typecheck**: `npm run typecheck`
- **unit/component tests**: `npm test`
- **coverage**: `npm run test:ci`
- **e2e**: `npm run test:e2e`

## Architecture

See `ARCHITECTURE.md`.

## CI

GitHub Actions workflow: `.github/workflows/ci.yml` runs lint, typecheck, tests, build, and Playwright.
