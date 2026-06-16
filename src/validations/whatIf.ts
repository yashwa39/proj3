import { z } from "zod";

export const whatIfSchema = z.object({
  query: z
    .string()
    .trim()
    .min(1, "Please enter a what-if question.")
    .max(200, "Query must be 200 characters or fewer."),
});

export type WhatIfFormValues = z.infer<typeof whatIfSchema>;
