# Architecture

## Folder structure

```
src/
├── app/                 # Next.js App Router routes/layouts
├── components/
│   ├── ui/              # shadcn-style primitives (Button, Card, Dialog, etc.)
│   ├── forms/           # React Hook Form components
│   ├── dashboard/       # reserved (future)
│   ├── layout/          # Navbar/Footer/etc.
│   └── common/          # sections and shared UI
├── hooks/               # reserved (future)
├── lib/                 # utilities, env, sanitization, constants
├── services/            # API/service layer (typed, validated)
├── store/               # Zustand stores (selectors, minimal rerenders)
├── types/               # shared TypeScript types
├── validations/         # Zod schemas
├── tests/               # Vitest setup + unit/component tests
└── styles/              # global styles
```

## Design decisions

- **App Router + server-first**: static landing content renders on the server; interactive parts are isolated to client components.
- **Validation**: user input is validated with Zod (client-side now; service layer ready for server-side enforcement).
- **State**: Zustand stores isolate social feed & challenges state, enabling selective subscriptions to prevent rerenders.
- **Security**:
  - CSP + baseline security headers via `next.config.ts`
  - DOMPurify utility (`src/lib/sanitize.ts`) to ensure any user-generated HTML is sanitized before rendering
  - strict TypeScript + centralized service patterns to reduce injection / data handling mistakes

## Testing strategy

- **Vitest**: unit tests for services/validations/stores and lightweight component tests.
- **Playwright**: smoke-level e2e of the main flow (homepage + what-if simulation).

## Scalability strategy

- Add real APIs under `src/app/api/*` with Zod request validation.
- Move mock services to real HTTP services in `src/services/*` using `httpJson()` for typed parsing + centralized error handling.
- Grow “dashboard” routes under `src/app/dashboard/*` and move complex UI into `src/components/dashboard/*`.
