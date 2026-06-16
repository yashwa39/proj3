import { describe, expect, it, vi } from "vitest";

import { simulateWhatIf } from "@/services/whatIfService";

describe("simulateWhatIf branch coverage", () => {
  it("matches scooter keywords", async () => {
    vi.useFakeTimers();
    try {
      const p = simulateWhatIf({ query: "I want an EV scooter" });
      vi.advanceTimersByTime(500);
      const r = await p;
      expect(r.cat).toBe("Transport");
    } finally {
      vi.useRealTimers();
    }
  });

  it("matches meat keywords", async () => {
    vi.useFakeTimers();
    try {
      const p = simulateWhatIf({ query: "What if I eat less meat?" });
      vi.advanceTimersByTime(500);
      const r = await p;
      expect(r.cat).toBe("Diet");
    } finally {
      vi.useRealTimers();
    }
  });

  it("matches solar keywords", async () => {
    vi.useFakeTimers();
    try {
      const p = simulateWhatIf({ query: "Install solar panels" });
      vi.advanceTimersByTime(500);
      const r = await p;
      expect(r.cat).toBe("Energy");
      expect(r.be).toBe("36 mo");
    } finally {
      vi.useRealTimers();
    }
  });

  it("matches work-from-home keywords", async () => {
    vi.useFakeTimers();
    try {
      const p = simulateWhatIf({ query: "WFH three days" });
      vi.advanceTimersByTime(500);
      const r = await p;
      expect(r.cat).toBe("Transport");
    } finally {
      vi.useRealTimers();
    }
  });

  it("defaults to AC scenario for unknown query", async () => {
    vi.useFakeTimers();
    try {
      const p = simulateWhatIf({ query: "What if I meditate?" });
      vi.advanceTimersByTime(500);
      const r = await p;
      expect(r.co2).toBe("8.5 kg");
    } finally {
      vi.useRealTimers();
    }
  });

  it("rejects invalid input", async () => {
    await expect(simulateWhatIf({ query: "   " })).rejects.toThrow(/please enter/i);
  });
});
