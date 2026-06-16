import { describe, expect, it, vi } from "vitest";

import { useToastStore } from "@/store/toastStore";

describe("toastStore", () => {
  it("push adds a toast and auto-dismisses it", () => {
    vi.useFakeTimers();
    try {
      useToastStore.setState({ toasts: [] });
      useToastStore.getState().push({
        title: "Hello",
        description: "World",
        variant: "success",
      });

      expect(useToastStore.getState().toasts.length).toBe(1);
      const id = useToastStore.getState().toasts[0]!.id;

      vi.advanceTimersByTime(4499);
      expect(useToastStore.getState().toasts.some((t) => t.id === id)).toBe(true);

      vi.advanceTimersByTime(2);
      expect(useToastStore.getState().toasts.some((t) => t.id === id)).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it("dismiss removes a toast by id", () => {
    useToastStore.setState({
      toasts: [{ id: "a", title: "t", variant: "default" }],
    });
    useToastStore.getState().dismiss("a");
    expect(useToastStore.getState().toasts.length).toBe(0);
  });
});
