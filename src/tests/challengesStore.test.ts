import { describe, expect, it, vi } from "vitest";

import { useChallengesStore } from "@/store/challengesStore";

// Helper: reset store to a clean 3-item baseline
function resetStore() {
  useChallengesStore.setState({
    refreshing: false,
    items: [
      {
        difficulty: "Easy",
        pointsLabel: "+45 pts",
        label: "Use digital notes for one week",
        savesLabel: "2.3 kg CO₂",
        done: false,
      },
      {
        difficulty: "Medium",
        pointsLabel: "+120 pts",
        label: "Skip one food delivery this week",
        savesLabel: "5.1 kg CO₂",
        done: false,
      },
      {
        difficulty: "Hard",
        pointsLabel: "+280 pts",
        label: "Work remotely one extra day",
        savesLabel: "12.0 kg CO₂",
        done: false,
      },
    ],
  });
}

describe("challengesStore — complete()", () => {
  it("marks the item done", () => {
    resetStore();
    useChallengesStore.getState().complete(0);
    expect(useChallengesStore.getState().items[0]!.done).toBe(true);
  });

  it("increases totalSavedKg after completing", () => {
    resetStore();
    const before = useChallengesStore.getState().totalSavedKg();
    useChallengesStore.getState().complete(0);
    const after = useChallengesStore.getState().totalSavedKg();
    expect(after).toBeGreaterThan(before);
    expect(after).toBeCloseTo(2.3, 1);
  });

  it("completing all three adds up correctly", () => {
    resetStore();
    useChallengesStore.getState().complete(0);
    useChallengesStore.getState().complete(1);
    useChallengesStore.getState().complete(2);
    const total = useChallengesStore.getState().totalSavedKg();
    // 2.3 + 5.1 + 12.0 = 19.4
    expect(total).toBeCloseTo(19.4, 1);
  });

  it("calling complete on an already-done item is idempotent", () => {
    resetStore();
    useChallengesStore.getState().complete(0);
    const after1 = useChallengesStore.getState().totalSavedKg();
    useChallengesStore.getState().complete(0);
    const after2 = useChallengesStore.getState().totalSavedKg();
    expect(after1).toBe(after2);
  });

  it("does not throw for out-of-range index", () => {
    resetStore();
    expect(() => useChallengesStore.getState().complete(99)).not.toThrow();
  });

  it("other items remain untouched after completing one", () => {
    resetStore();
    useChallengesStore.getState().complete(1);
    expect(useChallengesStore.getState().items[0]!.done).toBe(false);
    expect(useChallengesStore.getState().items[2]!.done).toBe(false);
  });
});

describe("challengesStore — refresh()", () => {
  it("sets refreshing=true while pending, false when done", async () => {
    resetStore();
    vi.useFakeTimers();
    try {
      const p = useChallengesStore.getState().refresh();
      expect(useChallengesStore.getState().refreshing).toBe(true);
      vi.advanceTimersByTime(600);
      await p;
      expect(useChallengesStore.getState().refreshing).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it("replaces the first item with something different", async () => {
    resetStore();
    vi.useFakeTimers();
    try {
      const before = useChallengesStore.getState().items[0]!.label;
      const p = useChallengesStore.getState().refresh();
      vi.advanceTimersByTime(600);
      await p;
      const after = useChallengesStore.getState().items[0]!.label;
      expect(after).not.toBe(before);
    } finally {
      vi.useRealTimers();
    }
  });

  it("still has 3 items after refresh", async () => {
    resetStore();
    vi.useFakeTimers();
    try {
      const p = useChallengesStore.getState().refresh();
      vi.advanceTimersByTime(600);
      await p;
      expect(useChallengesStore.getState().items).toHaveLength(3);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("challengesStore — totalSavedKg()", () => {
  it("returns 0 when nothing is done", () => {
    resetStore();
    expect(useChallengesStore.getState().totalSavedKg()).toBe(0);
  });

  it("handles malformed savesLabel gracefully", () => {
    resetStore();
    useChallengesStore.setState({
      items: [
        {
          difficulty: "Easy",
          pointsLabel: "+10 pts",
          label: "x",
          savesLabel: "no-number",
          done: true,
        },
      ],
    });
    expect(useChallengesStore.getState().totalSavedKg()).toBe(0);
  });
});
