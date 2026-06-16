import { describe, expect, it } from "vitest";

import { shareEcoHackSchema } from "@/validations/shareEcoHack";
import { whatIfSchema } from "@/validations/whatIf";

describe("whatIfSchema", () => {
  it("accepts a 1-character query", () => {
    const r = whatIfSchema.safeParse({ query: "a" });
    expect(r.success).toBe(true);
  });

  it("accepts exactly 200 characters", () => {
    const r = whatIfSchema.safeParse({ query: "a".repeat(200) });
    expect(r.success).toBe(true);
  });

  it("rejects 201 characters", () => {
    const r = whatIfSchema.safeParse({ query: "a".repeat(201) });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.message).toMatch(/200 characters/i);
  });

  it("rejects empty string", () => {
    const r = whatIfSchema.safeParse({ query: "" });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.message).toMatch(/Please enter/i);
  });

  it("rejects whitespace-only string (trimmed to empty)", () => {
    const r = whatIfSchema.safeParse({ query: "   " });
    expect(r.success).toBe(false);
  });

  it("trims surrounding whitespace before validating", () => {
    const r = whatIfSchema.safeParse({ query: "  hello  " });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.query).toBe("hello");
  });

  it("rejects missing query field", () => {
    const r = whatIfSchema.safeParse({});
    expect(r.success).toBe(false);
  });
});

describe("shareEcoHackSchema", () => {
  const valid = { description: "Turn off lights", category: "Energy", savingsKg: 1.0 };

  it("accepts a valid payload", () => {
    expect(shareEcoHackSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects savingsKg = 0", () => {
    const r = shareEcoHackSchema.safeParse({ ...valid, savingsKg: 0 });
    expect(r.success).toBe(false);
  });

  it("rejects savingsKg = -1", () => {
    const r = shareEcoHackSchema.safeParse({ ...valid, savingsKg: -1 });
    expect(r.success).toBe(false);
  });

  it("accepts savingsKg at maximum boundary (500)", () => {
    const r = shareEcoHackSchema.safeParse({ ...valid, savingsKg: 500 });
    expect(r.success).toBe(true);
  });

  it("rejects savingsKg above 500", () => {
    const r = shareEcoHackSchema.safeParse({ ...valid, savingsKg: 500.01 });
    expect(r.success).toBe(false);
  });

  it("rejects description longer than 300 chars", () => {
    const r = shareEcoHackSchema.safeParse({ ...valid, description: "x".repeat(301) });
    expect(r.success).toBe(false);
  });

  it("accepts description of exactly 300 chars", () => {
    const r = shareEcoHackSchema.safeParse({ ...valid, description: "x".repeat(300) });
    expect(r.success).toBe(true);
  });

  it("rejects empty description", () => {
    const r = shareEcoHackSchema.safeParse({ ...valid, description: "" });
    expect(r.success).toBe(false);
  });

  it("rejects missing category", () => {
    const r = shareEcoHackSchema.safeParse({ description: "hello", savingsKg: 1 });
    expect(r.success).toBe(false);
  });
});
