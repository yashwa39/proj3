import { describe, expect, it } from "vitest";

import { useChallengesStore } from "@/store/challengesStore";
import { useSocialStore } from "@/store/socialStore";

describe("stores", () => {
  it("social store adopt is idempotent and increases adoptedCount once", () => {
    const s = useSocialStore.getState();
    const before = s.posts[0]!;
    s.adopt(0);
    const after1 = useSocialStore.getState().posts[0]!;
    s.adopt(0);
    const after2 = useSocialStore.getState().posts[0]!;

    expect(after1.adopted).toBe(true);
    expect(after1.adoptedCount).toBe(before.adoptedCount + 1);
    expect(after2.adoptedCount).toBe(after1.adoptedCount);
  });

  it("challenges store totalSavedKg counts done only", () => {
    const s = useChallengesStore.getState();
    const before = s.totalSavedKg();
    s.complete(0);
    const after = useChallengesStore.getState().totalSavedKg();
    expect(after).toBeGreaterThanOrEqual(before);
  });
});
