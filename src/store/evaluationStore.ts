import { create } from "zustand";

interface EvaluationItem {
  id: string;
  label: string;
  score: number;
}

interface EvaluationState {
  evaluations: EvaluationItem[];
  setEvaluations: (items: EvaluationItem[]) => void;
}

export const useEvaluationStore = create<EvaluationState>((set) => ({
  evaluations: [],
  setEvaluations: (items) => set({ evaluations: items }),
}));
