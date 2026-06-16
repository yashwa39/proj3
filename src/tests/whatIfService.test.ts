import { describe, expect, it } from "vitest";

import { simulateWhatIf } from "@/services/whatIfService";

describe("simulateWhatIf", () => {
  it("matches scooter keywords", async () => {
    const r = await simulateWhatIf({ query: "What if I buy an EV scooter?" });
    expect(r.cat).toBe("Transport");
    expect(r.co2).toBe("18.4 kg");
  });

  it("validates empty input", async () => {
    await expect(simulateWhatIf({ query: "   " })).rejects.toThrow(/Please enter/i);
  });
});
