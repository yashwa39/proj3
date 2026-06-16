# Accessibility (WCAG 2.1 AA)

## Goals

- Keyboard-first usability (no mouse required)
- Correct landmarks and semantics
- Accessible forms and validation
- Visible focus indicators
- Respect `prefers-reduced-motion`

## Implemented

- **Skip navigation**: `.skip-link` in `src/styles/globals.css` and used on page.
- **Landmarks**: `nav`, `main`, `section`, `footer` used consistently.
- **Focus visibility**: components use `focus-visible:ring` consistently.
- **Forms**
  - Inputs have labels (visible or `sr-only`)
  - Validation errors are announced with `role="alert"`
  - Character counters use `aria-live="polite"`
- **Dialogs**
  - Radix `Dialog` provides focus management and escape-to-close.

## Manual QA checklist

- Tab through the entire page: focus never disappears or gets trapped unintentionally.
- Screen reader: headings and regions are announced meaningfully.
- Color contrast: small text uses `text-slate-400` or stronger on dark backgrounds.
- Reduced motion: verify animations are minimized with OS setting enabled.
