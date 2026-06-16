import { submissionSchema, type SubmissionFormValues } from "@/validations/submission";

export async function createSubmission(values: SubmissionFormValues) {
  const parsed = submissionSchema.parse(values);
  await new Promise((r) => setTimeout(r, 120));
  return { id: crypto.randomUUID(), ...parsed, status: "pending" as const };
}
