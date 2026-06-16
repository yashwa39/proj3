# CarbonMirror — Production Audit Report

**Audited:** `index.html` (1186 lines original)  
**Output files:** `index.html` (refactored), `js/utils.js`, `tests/unit.test.js`  
**Test results:** 74/74 pass (`node --test tests/unit.test.js`)

---

## Summary of Scores (Before → Target)

| Dimension         | Before | Issues Found | Status     |
|-------------------|--------|--------------|------------|
| Code Quality      | 58     | 9 issues     | ✅ Fixed   |
| Security          | 45     | 8 issues     | ✅ Fixed   |
| Efficiency        | 40     | 9 issues     | ✅ Fixed   |
| Accessibility     | 55     | 15 issues    | ✅ Fixed   |
| Testing           | 0      | No tests     | ✅ Created |
| Problem Alignment | 59     | 5 issues     | ✅ Fixed   |

---

## 1. Code Quality

### Issues Found & Fixed

| # | Severity | Issue | Fix Applied |
|---|----------|-------|-------------|
| CQ-1 | High | `font-700`, `font-800`, `font-900` are not valid Tailwind utility classes | Added `fontWeight` extensions in tailwind config AND replaced all occurrences with semantic classes: `font-bold`, `font-semibold`, `font-extrabold`, `font-black` |
| CQ-2 | High | No CONFIG object — hardcoded values scattered throughout functions | Created `CarbonMirrorUtils.CONFIG` in `js/utils.js` with all thresholds, data arrays, colors, and factors |
| CQ-3 | High | Monolithic Alpine functions with no JSDoc | Added full JSDoc (`@param`, `@returns`, `@type`) to every function and computed property |
| CQ-4 | Medium | Ambiguous variable names: `p` (post), `i` (index), `c` (challenge) | Renamed to `post`, `index`/`postIndex`, `challenge` throughout Alpine templates and functions |
| CQ-5 | Medium | No meaningful HTML section comments | Added `<!-- ═══ SECTION NAME ═══ -->` banner comments for all 10 sections |
| CQ-6 | Medium | Alpine component functions were mixed with data inline, no separation | Extracted pure utility functions to `js/utils.js` as ES module-style exports; Alpine components reference `CarbonMirrorUtils.*` |
| CQ-7 | Low | Duplicate inline styles (e.g., repeated `style="box-shadow:..."`) | Consolidated repeating patterns into named CSS classes (`.ring-spin`, `.muted`, `.section-label`, `.focus-ring`) |
| CQ-8 | Low | `.count-tick` CSS animation class defined but never properly triggered | Removed the animation class; live-updated values use `aria-live` instead for accessibility-correct updates |
| CQ-9 | Low | `simulator()` function was monolithic — chart init, data, computed all in one blob | Split into: data (in CONFIG), computed getters (`cur`, `better`, `green`, `pct`, `timelineLabel`), chart init method, `update()` method, `debouncedUpdate` binding |

---

## 2. Security

### Issues Found & Fixed

| # | Severity | Issue | Fix Applied |
|---|----------|-------|-------------|
| S-1 | Critical | No Content-Security-Policy | Added CSP `<meta>` tag allowing only self + specific CDN domains |
| S-2 | High | No X-Content-Type-Options | Added `<meta http-equiv="X-Content-Type-Options" content="nosniff">` |
| S-3 | High | No X-Frame-Options equivalent | Added `<meta http-equiv="X-Frame-Options" content="DENY">` |
| S-4 | Medium | External links missing `rel="noopener noreferrer"` | Added to all footer `<a>` tags pointing to external `#` hrefs |
| S-5 | Medium | What-If input had HTML `maxlength=200` but no JS enforcement | Added `validateWhatIfInput()` in utils.js; `runSimulate()` checks validation before proceeding; extra `.slice(0, 200)` guard applied to query before lookup |
| S-6 | Medium | No sanitization helper for user-visible text content | Added `sanitizeText(input)` in utils.js; applied to social feed post text and simulation result category display in Alpine templates |
| S-7 | Low | What-If input missing `autocomplete="off"` | Added `autocomplete="off"` attribute |
| S-8 | Low | No check for sensitive data in localStorage | Confirmed: no localStorage usage in codebase. No PII stored client-side. |

---

## 3. Efficiency

### Issues Found & Fixed

| # | Severity | Issue | Fix Applied |
|---|----------|-------|-------------|
| EF-1 | High | GSAP and ScrollTrigger loaded in `<head>` — render blocking | Moved all `<script>` tags (Chart.js, GSAP, Alpine) to bottom of `<body>`. Only Tailwind CDN remains in `<head>` with `fetchpriority="high"` |
| EF-2 | High | GSAP ScrollTrigger used for every `.reveal` element — heavy | Replaced with `IntersectionObserver` in `app().init()`. GSAP now only handles the hero entrance animation (above-fold, justified use) |
| EF-3 | High | Chart.js: no chart instance cleanup before re-init (memory leak) | `chartInstance` variable tracked; `chartInstance.destroy()` called before creating new Chart |
| EF-4 | Medium | Slider `@input` fires on every pixel during drag | Added `debounce(fn, 80)` utility; bound as `this.debouncedUpdate` in `simulator.init()` |
| EF-5 | Medium | Google Fonts loaded with no preload or `font-display: swap` | Added `<link rel="preload" as="style">` + `font-display: swap` via `media="print"` swap pattern |
| EF-6 | Medium | `.noise::after` SVG data URL texture — expensive GPU compositing | Removed entirely; hero glow gradient provides visual depth without the SVG data URL |
| EF-7 | Low | `will-change: transform` missing on animated spinning rings | Added `.ring-spin { will-change: transform }` CSS class applied only to the two orbiting ring divs |
| EF-8 | Low | No `fetchpriority="high"` on above-fold resources | Added `fetchpriority="high"` to Tailwind CDN script tag |
| EF-9 | Low | Fonts loaded synchronously blocking render | Converted to `media="print" onload="this.media='all'"` non-blocking pattern with `<noscript>` fallback |

---

## 4. Accessibility

### Issues Found & Fixed

| # | Severity | Issue | Fix Applied |
|---|----------|-------|-------------|
| A-1 | Critical | No skip-to-content link | Added `<a href="#main-content" class="skip-link">Skip to main content</a>` as first child of `<body>` |
| A-2 | Critical | No `<main>` landmark | Wrapped all sections (except nav + footer) in `<main id="main-content">` |
| A-3 | High | Mobile menu button missing `aria-expanded` and `aria-controls` | Added `:aria-expanded="open.toString()"` + `aria-controls="mobile-menu"` + `id="mobile-menu"` on menu div |
| A-4 | High | No focus trap in mobile menu | Added Alpine `x-trap.inert.noscroll="open"` on both the mobile menu div and the share modal |
| A-5 | High | Simulator slider missing ARIA value attributes | Added `aria-valuemin`, `aria-valuemax`, `:aria-valuenow`, `:aria-valuetext` |
| A-6 | High | Avatar slider missing complete ARIA value attributes | Added `aria-valuemin`, `aria-valuemax`, `:aria-valuenow`, `:aria-valuetext` (bound to `avatarLabel`) |
| A-7 | High | Chart canvas had only `aria-label` but no linked description | Added `<p id="sim-chart-desc" class="sr-only">` describing the chart; canvas uses `aria-describedby="sim-chart-desc"` |
| A-8 | Medium | `role="navigation"` and `aria-label` missing from `<nav>` | Added `role="navigation"` + `aria-label="Main navigation"` |
| A-9 | Medium | `text-slate-500` on dark bg (#020617) = 3.84:1 — fails WCAG AA for small text | Changed all body copy muted text to `text-slate-400` (#94a3b8 = 4.6:1 ratio) via `.muted` utility class |
| A-10 | Medium | `text-brand/70` section labels — insufficient contrast | Changed `.section-label` to use `color: rgba(34,197,94,.9)` (~5.2:1 on dark bg) |
| A-11 | Medium | Challenge items not keyboard-accessible (only mouse `@click`) | Added `tabindex="0"`, `@keydown.enter`, `@keydown.space.prevent` to challenge list items |
| A-12 | Medium | Stats numbers (7, 10yr, ∞) had no descriptive `aria-label` | Added descriptive `aria-label` to each stat number div |
| A-13 | Medium | "Today's footprint" label was a `<div>` acting as label | Changed to semantic `<p>` element |
| A-14 | Medium | `aria-live="polite"` elements missing `role="status"` | Added `role="status"` to timeline label, community kg, and all live-updated values |
| A-15 | Low | Not all buttons have visible focus rings | Added `.focus-ring` utility class (`focus-visible:outline` + `outline-offset:2px`) applied to every interactive element |

---

## 5. Testing

### Tests Created: `tests/unit.test.js`

- **Framework:** Node.js built-in `node:test` + `assert/strict` (Node 18+)
- **Run command:** `node --test tests/unit.test.js`
- **Result:** 74/74 tests pass ✅

| Function | Tests | Coverage |
|----------|-------|----------|
| `CONFIG` | 7 | Constants, keys, lengths |
| `sanitizeText` | 10 | null/undefined, HTML stripping, whitespace, truncation |
| `getAvatarState` | 10 | Boundary values (29/30/70/71), string inputs, NaN |
| `getSimulatorData` | 9 | All 3 indices, string index, reduction ratios, RangeError |
| `formatCO2` | 6 | Thousands separator, decimals, zero, NaN, negative |
| `lookupWhatIf` | 11 | All keywords, aliases (ev/bike), unknown, null, empty |
| `validateWhatIfInput` | 8 | Valid, empty, whitespace, null, undefined, boundary 200/201 |
| `getCommunityTotal` | 6 | Empty, non-array, adopted-only, NaN savings |
| `getChallengeTotalSaved` | 7 | Empty, non-array, saves parsing, rounding, all-done |

---

## 6. Problem Alignment

### Issues Found & Fixed

| # | Severity | Issue | Fix Applied |
|---|----------|-------|-------------|
| PA-1 | High | "Apply this change" button had no feedback — clicked and nothing happened | Added `applied` state in `whatIf()` component; button switches to "Profile updated ✓" with green checkmark after click |
| PA-2 | Medium | Challenges "Refresh" button had no loading state | Added `refreshing` boolean; button shows animated spinner and "Refreshing…" text during 600ms timeout |
| PA-3 | Medium | "Share Your Eco-Hack" button did nothing | Added full Alpine modal (`shareModalOpen`) with validated form (description 1-300 chars, category select, savings 0.01-500 kg); submits to feed optimistically |
| PA-4 | Low | No methodology explanation anywhere on the page | Added `#methodology` section before footer explaining IPCC AR6, EPA, and DEFRA data sources with a "Learn more" footer link |
| PA-5 | Low | Download buttons (App Store / Google Play) implied the app was available | Added CSS tooltip (`.tooltip-wrap`) showing "Coming Soon" on hover/focus for both download buttons |

---

## Files Changed

```
index.html          ← Fully refactored (all 6 dimensions)
js/utils.js         ← New: extracted pure utility functions + CONFIG (CommonJS + browser global)
tests/unit.test.js  ← New: 74 unit tests (node --test)
AUDIT_REPORT.md     ← This file
```

---

## Technical Notes

### utils.js dual-mode pattern
Uses IIFE with `(typeof module !== 'undefined' ? module.exports : (window.CarbonMirrorUtils = {}))` to work both in Node.js (CommonJS `require`) and the browser (`window.CarbonMirrorUtils`). No ES module `import` used to avoid `file://` CORS issues.

### IntersectionObserver vs GSAP ScrollTrigger
ScrollTrigger adds ~40 KB to the GSAP bundle. The replacement `IntersectionObserver` is zero-cost (native browser API) and handles all `.reveal` section animations with equivalent visual effect. GSAP is retained only for the hero entrance sequence where timeline sequencing adds real value.

### Chart.js memory management
The `chartInstance` variable is scoped to the `simulator()` factory closure, persisting across Alpine's reactive re-renders. `destroy()` is called before any re-initialization to prevent Canvas memory leaks.
