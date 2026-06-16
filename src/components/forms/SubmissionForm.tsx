"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { submissionSchema, type SubmissionFormValues } from "@/validations/submission";

export function SubmissionForm({
  onSubmit,
}: {
  onSubmit?: (values: SubmissionFormValues) => void;
}) {
  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: { title: "", summary: "", priority: "medium" },
  });

  return (
    <form
      className="space-y-3"
      onSubmit={form.handleSubmit((v) => onSubmit?.(v))}
      noValidate
    >
      <input
        aria-label="Submission title"
        className="w-full rounded-xl border border-slate-700/50 bg-surface-2/70 p-3 text-sm text-slate-100"
        placeholder="Submission title"
        {...form.register("title")}
      />
      <textarea
        aria-label="Submission summary"
        rows={4}
        className="w-full rounded-xl border border-slate-700/50 bg-surface-2/70 p-3 text-sm text-slate-100"
        placeholder="Summary"
        {...form.register("summary")}
      />
      <select
        aria-label="Priority"
        className="w-full rounded-xl border border-slate-700/50 bg-surface-2/70 p-3 text-sm text-slate-100"
        {...form.register("priority")}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <Button type="submit">Submit</Button>
    </form>
  );
}
