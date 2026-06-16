import { describe, expect, it, beforeEach } from "vitest";

import { useSocialStore } from "@/store/socialStore";

const BASELINE = 42180.5;

beforeEach(() => {
  // Reset to known initial state
  useSocialStore.setState({
    baselineKg: BASELINE,
    posts: [
      {
        user: "@p",
        initial: "P",
        tag: "Transport",
        text: "test1",
        savesKgPerMonth: 4.2,
        adoptedCount: 10,
        adopted: false,
      },
      {
        user: "@r",
        initial: "R",
        tag: "Energy",
        text: "test2",
        savesKgPerMonth: 1.8,
        adoptedCount: 20,
        adopted: false,
      },
      {
        user: "@m",
        initial: "M",
        tag: "Diet",
        text: "test3",
        savesKgPerMonth: 7.6,
        adoptedCount: 30,
        adopted: false,
      },
    ],
  });
});

describe("socialStore — getCommunityTotalKg()", () => {
  it("equals baseline when nothing adopted", () => {
    expect(useSocialStore.getState().getCommunityTotalKg()).toBe(BASELINE);
  });

  it("adds adopted post savings to baseline", () => {
    useSocialStore.getState().adopt(0);
    const total = useSocialStore.getState().getCommunityTotalKg();
    expect(total).toBeCloseTo(BASELINE + 4.2, 1);
  });

  it("accumulates multiple adoptions", () => {
    useSocialStore.getState().adopt(0);
    useSocialStore.getState().adopt(1);
    const total = useSocialStore.getState().getCommunityTotalKg();
    expect(total).toBeCloseTo(BASELINE + 4.2 + 1.8, 1);
  });

  it("ignores non-finite savesKgPerMonth", () => {
    useSocialStore.setState((s) => ({
      posts: [
        { ...s.posts[0]!, savesKgPerMonth: Number.NaN, adopted: true },
        ...s.posts.slice(1),
      ],
    }));
    const total = useSocialStore.getState().getCommunityTotalKg();
    expect(total).toBe(BASELINE);
  });
});

describe("socialStore — adopt()", () => {
  it("marks post as adopted and increments count", () => {
    useSocialStore.getState().adopt(0);
    const post = useSocialStore.getState().posts[0]!;
    expect(post.adopted).toBe(true);
    expect(post.adoptedCount).toBe(11);
  });

  it("is idempotent — second call has no effect", () => {
    useSocialStore.getState().adopt(1);
    useSocialStore.getState().adopt(1);
    expect(useSocialStore.getState().posts[1]!.adoptedCount).toBe(21);
    expect(useSocialStore.getState().posts[1]!.adopted).toBe(true);
  });

  it("does not affect other posts", () => {
    useSocialStore.getState().adopt(0);
    expect(useSocialStore.getState().posts[1]!.adopted).toBe(false);
    expect(useSocialStore.getState().posts[2]!.adopted).toBe(false);
  });

  it("does not throw for out-of-range index", () => {
    expect(() => useSocialStore.getState().adopt(99)).not.toThrow();
  });
});

describe("socialStore — addPost()", () => {
  it("prepends the new post", () => {
    const before = useSocialStore.getState().posts.length;
    useSocialStore.getState().addPost({
      user: "@new",
      initial: "N",
      tag: "Other",
      text: "new eco-hack",
      savesKgPerMonth: 3.0,
    });
    const posts = useSocialStore.getState().posts;
    expect(posts.length).toBe(before + 1);
    expect(posts[0]!.user).toBe("@new");
    expect(posts[0]!.adopted).toBe(false);
    expect(posts[0]!.adoptedCount).toBe(0);
  });

  it("new post does not affect community total until adopted", () => {
    const before = useSocialStore.getState().getCommunityTotalKg();
    useSocialStore.getState().addPost({
      user: "@x",
      initial: "X",
      tag: "Energy",
      text: "turn off lights",
      savesKgPerMonth: 2.0,
    });
    expect(useSocialStore.getState().getCommunityTotalKg()).toBe(before);
  });
});
