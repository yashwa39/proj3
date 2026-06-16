import { describe, expect, it } from "vitest";

import { shareEcoHackSchema } from "@/validations/shareEcoHack";
import { whatIfSchema } from "@/validations/whatIf";

describe("zod validations", () => {
  it("whatIfSchema accepts <=200 chars", () => {
    const v = whatIfSchema.parse({ query: "a".repeat(200) });
    expect(v.query.length).toBe(200);
  });

  it("whatIfSchema rejects >200 chars", () => {
    const r = whatIfSchema.safeParse({ query: "a".repeat(201) });
    expect(r.success).toBe(false);
  });

  it("shareEcoHackSchema rejects savings too small", () => {
    const r = shareEcoHackSchema.safeParse({
      description: "hello",
      category: "Transport",
      savingsKg: 0,
    });
    expect(r.success).toBe(false);
  });
});
