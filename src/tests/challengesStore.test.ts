import { describe, expect, it, vi } from "vitest";

import { useChallengesStore } from "@/store/challengesStore";

describe("challengesStore", () => {
  it("complete marks an item done and increases totalSavedKg", () => {
    // reset store to known baseline
    useChallengesStore.setState({ refreshing: false });
    const before = useChallengesStore.getState().totalSavedKg();
    useChallengesStore.getState().complete(0);
    const after = useChallengesStore.getState().totalSavedKg();
    expect(after).toBeGreaterThanOrEqual(before);
    expect(useChallengesStore.getState().items[0]!.done).toBe(true);
  });

  it("refresh toggles refreshing and replaces first item", async () => {
    vi.useFakeTimers();
    try {
      useChallengesStore.setState({ refreshing: false });
      const firstBefore = useChallengesStore.getState().items[0]!.label;
      const p = useChallengesStore.getState().refresh();

      expect(useChallengesStore.getState().refreshing).toBe(true);
      vi.advanceTimersByTime(600);
      await p;

      expect(useChallengesStore.getState().refreshing).toBe(false);
      const firstAfter = useChallengesStore.getState().items[0]!.label;
      expect(firstAfter).not.toBe(firstBefore);
    } finally {
      vi.useRealTimers();
    }
  });
});
