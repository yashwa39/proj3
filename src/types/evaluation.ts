import type { ID } from "./utils";
import type { Score } from "./metrics";

export interface Evaluation {
  id: ID;
  submissionId: ID;
  createdAt: string;
  updatedAt: string;
  scores: Score[];
  overallScore: number; // 0-100
}

export interface DashboardData {
  overallScore: number;
  scores: Array<{
    category:
      | "Code Quality"
      | "Security"
      | "Efficiency"
      | "Accessibility"
      | "Testing"
      | "Problem Alignment";
    value: number;
    meaning: string;
    why: string;
    how: string;
    estimatedImpact: string;
  }>;
}
