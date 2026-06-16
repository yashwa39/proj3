# Security

## Threat model (current scope)

This project is a client-heavy Next.js application with interactive forms and user-provided text. Primary risks:

- **XSS** via user-provided content rendering
- **Sensitive data exposure** via error messages/logs
- **Insecure defaults** (missing headers, permissive CSP)
- **Supply-chain vulnerabilities** in dependencies

## Controls implemented

- **CSP + security headers** enforced in `next.config.ts`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` restrictive baseline
  - CSP is strict in prod, relaxed in dev for tooling

- **Input validation**
  - Zod schemas under `src/validations/*`
  - React Hook Form wired to Zod resolvers in form components

- **Output sanitization**
  - `src/lib/sanitize.ts` uses DOMPurify and converts user content to safe plain text for feed display.

- **Environment management**
  - `.env.example` committed, `.env.local` ignored
  - Public env parsed/validated in `src/lib/env.ts`

- **Dependency vulnerability posture**
  - `npm audit` is clean (0 vulnerabilities at last run).

## Security testing checklist

- Run: `npm audit`
- Run: `npm run lint && npm run typecheck`
- Run e2e: `npm run test:e2e`

## Reporting

If this were a public repo: add a private reporting channel and a disclosure policy.
