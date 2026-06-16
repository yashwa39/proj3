import { z } from "zod";

import { whatIfSchema } from "@/validations/whatIf";

const whatIfResultSchema = z.object({
  cat: z.string(),
  co2: z.string(),
  cost: z.string(),
  be: z.string(),
});

export type WhatIfResult = z.infer<typeof whatIfResultSchema>;

const DB: Record<string, WhatIfResult> = {
  scooter: { cat: "Transport", co2: "18.4 kg", cost: "₹1,200", be: "18 mo" },
  meat: { cat: "Diet", co2: "12.0 kg", cost: "₹800", be: "N/A" },
  solar: { cat: "Energy", co2: "35.0 kg", cost: "₹2,400", be: "36 mo" },
  home: { cat: "Transport", co2: "22.0 kg", cost: "₹1,600", be: "N/A" },
  ac: { cat: "Energy", co2: "8.5 kg", cost: "₹560", be: "N/A" },
};

export async function simulateWhatIf(input: { query: string }): Promise<WhatIfResult> {
  const parsed = whatIfSchema.safeParse(input);
  if (!parsed.success) {
    // In a real app we'd return structured errors; for now throw a safe message
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const q = parsed.data.query.toLowerCase();
  // mimic async inference time
  await new Promise((r) => setTimeout(r, 450));

  if (q.includes("scooter") || q.includes("bike") || q.includes("ev")) return DB.scooter;
  if (q.includes("meat") || q.includes("veg")) return DB.meat;
  if (q.includes("solar")) return DB.solar;
  if (q.includes("home") || q.includes("remote") || q.includes("wfh")) return DB.home;
  return DB.ac;
}
