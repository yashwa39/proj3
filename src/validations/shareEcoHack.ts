import { z } from "zod";

export const shareEcoHackSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description must be 1–300 characters.")
    .max(300, "Description must be 1–300 characters."),
  category: z.enum(["Transport", "Energy", "Diet", "Shopping", "Other"], {
    message: "Please select a category.",
  }),
  savingsKg: z.coerce
    .number()
    .min(0.01, "CO₂ savings must be between 0.01 and 500 kg/month.")
    .max(500, "CO₂ savings must be between 0.01 and 500 kg/month."),
});

export type ShareEcoHackFormValues = z.infer<typeof shareEcoHackSchema>;
