import { describe, expect, it } from "vitest";

import { simulateWhatIf } from "@/services/whatIfService";

describe("simulateWhatIf — keyword branches", () => {
  it("matches 'bike' keyword → Transport", async () => {
    const r = await simulateWhatIf({ query: "What if I get a bike instead?" });
    expect(r.cat).toBe("Transport");
  });

  it("matches 'ev' keyword → Transport", async () => {
    const r = await simulateWhatIf({ query: "What if I buy an EV?" });
    expect(r.cat).toBe("Transport");
  });

  it("matches 'meat' keyword → Diet", async () => {
    const r = await simulateWhatIf({ query: "What if I reduce meat?" });
    expect(r.cat).toBe("Diet");
    expect(r.co2).toBe("12.0 kg");
  });

  it("matches 'veg' keyword → Diet", async () => {
    const r = await simulateWhatIf({ query: "Go vegetarian twice a week" });
    expect(r.cat).toBe("Diet");
  });

  it("matches 'solar' keyword → Energy", async () => {
    const r = await simulateWhatIf({ query: "What if I install solar panels?" });
    expect(r.cat).toBe("Energy");
    expect(r.co2).toBe("35.0 kg");
    expect(r.be).toBe("36 mo");
  });

  it("matches 'home' keyword → Transport", async () => {
    const r = await simulateWhatIf({ query: "What if I work from home?" });
    expect(r.cat).toBe("Transport");
  });

  it("matches 'remote' keyword → Transport", async () => {
    const r = await simulateWhatIf({ query: "What if I go remote 3 days?" });
    expect(r.cat).toBe("Transport");
  });

  it("matches 'wfh' keyword → Transport", async () => {
    const r = await simulateWhatIf({ query: "I plan to WFH more" });
    expect(r.cat).toBe("Transport");
  });

  it("returns AC fallback for unrecognised query", async () => {
    const r = await simulateWhatIf({ query: "What if I change my curtains?" });
    expect(r.cat).toBe("Energy");
    expect(r.co2).toBe("8.5 kg");
  });

  it("rejects empty query", async () => {
    await expect(simulateWhatIf({ query: "" })).rejects.toThrow(/Please enter/i);
  });

  it("rejects whitespace-only query", async () => {
    await expect(simulateWhatIf({ query: "   " })).rejects.toThrow(/Please enter/i);
  });

  it("rejects query longer than 200 chars", async () => {
    await expect(simulateWhatIf({ query: "x".repeat(201) })).rejects.toThrow(
      /200 characters/i,
    );
  });

  it("accepts query of exactly 200 chars", async () => {
    const r = await simulateWhatIf({ query: "a".repeat(200) });
    expect(r).toBeDefined();
    expect(typeof r.cat).toBe("string");
  });

  it("returns an object with required keys", async () => {
    const r = await simulateWhatIf({ query: "solar panels" });
    expect(r).toHaveProperty("cat");
    expect(r).toHaveProperty("co2");
    expect(r).toHaveProperty("cost");
    expect(r).toHaveProperty("be");
  });

  it("result values are non-empty strings", async () => {
    const r = await simulateWhatIf({ query: "electric scooter" });
    expect(r.cat.length).toBeGreaterThan(0);
    expect(r.co2.length).toBeGreaterThan(0);
    expect(r.cost.length).toBeGreaterThan(0);
    expect(r.be.length).toBeGreaterThan(0);
  });
});
