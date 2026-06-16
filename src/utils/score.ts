export function clampScore(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function scoreBand(value: number) {
  const v = clampScore(value);
  if (v >= 90) return "excellent";
  if (v >= 75) return "good";
  if (v >= 60) return "fair";
  return "poor";
}
