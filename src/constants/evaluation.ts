/**
 * IMPORTANT: These scores are illustrative demo values.
 * In production they would be computed server-side from live analysis.
 */
export const EVALUATION_DIMENSIONS = [
  {
    key: "code-quality",
    label: "Code Quality",
    value: 92,
    meaning: "Measures maintainability, readability, and architecture hygiene.",
    why: "High-quality code reduces defects and speeds up future delivery.",
    how: "Modularize features, remove duplication, and enforce lint/type rules.",
    estimatedImpact: "+8 to +15 overall score when sustained.",
  },
  {
    key: "security",
    label: "Security",
    value: 91,
    meaning: "Indicates resistance to common application vulnerabilities.",
    why: "Security failures can cause outages, data loss, and compliance risk.",
    how: "Validate input, sanitize output, apply CSP/headers, and audit deps.",
    estimatedImpact: "+10 to +20 score in security-heavy evaluations.",
  },
  {
    key: "efficiency",
    label: "Efficiency",
    value: 90,
    meaning: "Represents runtime performance and resource usage.",
    why: "Efficient apps improve UX and reduce hosting costs.",
    how: "Debounce expensive work, split bundles, and avoid rerenders.",
    estimatedImpact: "+7 to +12 in efficiency/performance categories.",
  },
  {
    key: "accessibility",
    label: "Accessibility",
    value: 94,
    meaning: "Tracks WCAG 2.1 AA compliance and inclusive interactions.",
    why: "Accessibility broadens reach and reduces legal/compliance risk.",
    how: "Use semantic landmarks, keyboard support, labels, and contrast-safe UI.",
    estimatedImpact: "+10 to +18 in a11y scoring systems.",
  },
  {
    key: "testing",
    label: "Testing",
    value: 91,
    meaning: "Reflects confidence through automated unit/integration/e2e checks.",
    why: "Strong test coverage catches regressions before release.",
    how: "Maintain high coverage with branch-focused tests and CI gates.",
    estimatedImpact: "+12 to +22 in reliability/testing dimensions.",
  },
  {
    key: "problem-alignment",
    label: "Problem Alignment",
    value: 93,
    meaning: "Shows how clearly the product translates metrics into action.",
    why: "Users need actionable guidance, not only dashboards and scores.",
    how: "Provide issue summaries, root causes, and prioritized action plans.",
    estimatedImpact: "+10 to +18 in product-alignment scoring.",
  },
] as const;

export const OVERALL_SCORE = Math.round(
  EVALUATION_DIMENSIONS.reduce((sum, d) => sum + d.value, 0) /
    EVALUATION_DIMENSIONS.length,
);
