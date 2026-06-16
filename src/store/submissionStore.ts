import { create } from "zustand";

type Submission = {
  id: string;
  title: string;
  status: "pending" | "processed" | "failed";
};

interface SubmissionState {
  items: Submission[];
  add: (submission: Submission) => void;
}

export const useSubmissionStore = create<SubmissionState>((set) => ({
  items: [],
  add: (submission) => set((state) => ({ items: [submission, ...state.items] })),
}));
