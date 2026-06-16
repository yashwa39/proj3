export interface Metric {
  key: string;
  label: string;
  weight: number;
  description?: string;
}

export interface Score {
  metricKey: string;
  value: number; // 0-100
  notes?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  severity: "low" | "medium" | "high";
  whyItMatters: string;
  howToImprove: string;
  estimatedImpact: string;
}
