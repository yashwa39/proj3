import { create } from "zustand";

export type ToastVariant = "default" | "success" | "error";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

function id() {
  return Math.random().toString(36).slice(2, 10);
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) => {
    const toastId = id();
    set((state) => ({
      toasts: [{ ...toast, id: toastId }, ...state.toasts].slice(0, 3),
    }));
    // Auto-dismiss so users always see "something happened".
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== toastId) }));
    }, 4500);
  },
  dismiss: (toastId) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== toastId) })),
}));
