export async function fetchEvaluations() {
  await new Promise((r) => setTimeout(r, 120));
  return [
    { id: "eq-1", label: "Code Quality", score: 92 },
    { id: "eq-2", label: "Security", score: 91 },
    { id: "eq-3", label: "Accessibility", score: 94 },
  ] as const;
}
