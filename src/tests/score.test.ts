import { describe, expect, it } from "vitest";

import { clampScore, scoreBand } from "@/utils/score";

describe("clampScore", () => {
  it("returns the value unchanged when within [0,100]", () => {
    expect(clampScore(0)).toBe(0);
    expect(clampScore(50)).toBe(50);
    expect(clampScore(100)).toBe(100);
  });

  it("clamps negative values to 0", () => {
    expect(clampScore(-1)).toBe(0);
    expect(clampScore(-999)).toBe(0);
  });

  it("clamps values above 100 to 100", () => {
    expect(clampScore(101)).toBe(100);
    expect(clampScore(999)).toBe(100);
  });

  it("handles boundary exactly at 0 and 100", () => {
    expect(clampScore(0)).toBe(0);
    expect(clampScore(100)).toBe(100);
  });
});

describe("scoreBand", () => {
  it("returns 'excellent' for scores >= 90", () => {
    expect(scoreBand(90)).toBe("excellent");
    expect(scoreBand(100)).toBe("excellent");
    expect(scoreBand(95)).toBe("excellent");
  });

  it("returns 'good' for scores 75–89", () => {
    expect(scoreBand(75)).toBe("good");
    expect(scoreBand(89)).toBe("good");
    expect(scoreBand(80)).toBe("good");
  });

  it("returns 'fair' for scores 60–74", () => {
    expect(scoreBand(60)).toBe("fair");
    expect(scoreBand(74)).toBe("fair");
    expect(scoreBand(65)).toBe("fair");
  });

  it("returns 'poor' for scores below 60", () => {
    expect(scoreBand(0)).toBe("poor");
    expect(scoreBand(59)).toBe("poor");
  });

  it("clamps out-of-range input before banding", () => {
    expect(scoreBand(-10)).toBe("poor");
    expect(scoreBand(200)).toBe("excellent");
  });
});
