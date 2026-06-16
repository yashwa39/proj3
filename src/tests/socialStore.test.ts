import { describe, expect, it } from "vitest";

import { useSocialStore } from "@/store/socialStore";

describe("socialStore", () => {
  it("addPost prepends a new post", () => {
    const before = useSocialStore.getState().posts[0]!;
    useSocialStore.getState().addPost({
      user: "@you",
      initial: "Y",
      tag: "Other",
      text: "hello",
      savesKgPerMonth: 1.2,
    });
    const after = useSocialStore.getState().posts[0]!;
    expect(after.user).toBe("@you");
    expect(after.text).toBe("hello");
    expect(after).not.toEqual(before);
  });

  it("getCommunityTotalKg includes baseline and adopted saves", () => {
    // adopt first post
    useSocialStore.getState().adopt(0);
    const total = useSocialStore.getState().getCommunityTotalKg();
    expect(total).toBeGreaterThan(0);
  });
});
