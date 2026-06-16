import { z } from "zod";

export const submissionSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters."),
  summary: z.string().trim().min(20, "Summary must be at least 20 characters."),
  priority: z.enum(["low", "medium", "high"]),
});

export type SubmissionFormValues = z.infer<typeof submissionSchema>;
