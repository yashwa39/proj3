# Performance

## What we optimize for

- Low JS on initial load
- Fast interaction readiness
- Minimal re-renders in interactive sections
- Stable bundle sizes for CI evaluation systems

## Implemented

- **Server-first rendering** with Next.js App Router; client components are isolated.
- **Zustand selectors** used to reduce rerenders (`useSocialStore`, `useChallengesStore`, `useToastStore`).
- **Debounced updates** in the simulator chart to avoid thrashing.
- **Font optimization** via `next/font` (Inter + Fira Code with `display: swap`).
- **Image optimization readiness** via `next.config.ts` and default Next pipeline.
- **CSP** prevents unsafe runtime script patterns in production.

## Measurement

- Run locally: `npm run build`
- E2E: `npm run test:e2e`
- Consider Lighthouse in CI once deployment target exists.
