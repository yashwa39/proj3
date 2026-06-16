import { create } from "zustand";

interface DashboardState {
  selectedMetric: string | null;
  setSelectedMetric: (metric: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  selectedMetric: null,
  setSelectedMetric: (metric) => set({ selectedMetric: metric }),
}));
