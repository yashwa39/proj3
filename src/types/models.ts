export type ID = string;

export interface User {
  id: ID;
  handle: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: ID;
  userId: ID;
  createdAt: string;
  updatedAt: string;
  data: FormData;
}

export interface Metric {
  key: string;
  label: string;
  weight: number;
}

export interface Score {
  metricKey: string;
  value: number; // 0-100
  notes?: string;
}

export interface Evaluation {
  id: ID;
  submissionId: ID;
  createdAt: string;
  updatedAt: string;
  scores: Score[];
  overallScore: number; // 0-100
}

export interface APIResponse<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  requestId?: string;
}

export interface FormData {
  whatIfQuery?: string;
  ecoHackDescription?: string;
  ecoHackCategory?: "Transport" | "Energy" | "Diet" | "Shopping" | "Other";
  ecoHackSavingsKg?: number;
}

export interface DashboardState {
  isLoading: boolean;
  error: string | null;
  user: User | null;
  submissions: Submission[];
  evaluations: Evaluation[];
  preferences: {
    reducedMotion: boolean;
  };
}
