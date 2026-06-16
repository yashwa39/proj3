"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { simulateWhatIf, type WhatIfResult } from "@/services/whatIfService";
import { useToastStore } from "@/store/toastStore";
import { whatIfSchema, type WhatIfFormValues } from "@/validations/whatIf";

const SUGGESTIONS = [
  "What if I buy an electric scooter?",
  "What if I stop eating meat twice a week?",
  "What if I install solar panels?",
  "What if I work from home 3 days a week?",
] as const;

export function WhatIfForm() {
  const pushToast = useToastStore((s) => s.push);
  const [result, setResult] = React.useState<WhatIfResult | null>(null);
  const [applied, setApplied] = React.useState(false);

  const form = useForm<WhatIfFormValues>({
    resolver: zodResolver(whatIfSchema),
    defaultValues: { query: "" },
    mode: "onChange",
  });

  const query = form.watch("query");
  const remaining = 200 - (query?.length ?? 0);
  const warn = remaining <= 20;

  async function onSubmit(values: WhatIfFormValues) {
    setApplied(false);
    setResult(null);
    try {
      const res = await simulateWhatIf(values);
      setResult(res);
      pushToast({
        title: "Simulation complete",
        description: "Explore the numbers and apply the change if it fits you.",
        variant: "success",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      pushToast({ title: "Simulation failed", description: message, variant: "error" });
    }
  }

  return (
    <Card className="border-white/5 bg-surface/70">
      <CardContent className="p-8">
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="relative">
            <label htmlFor="wi-input" className="sr-only">
              Enter your what-if question (max 200 characters)
            </label>
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Search className="h-4 w-4" aria-hidden="true" />
            </div>
            <input
              id="wi-input"
              type="text"
              autoComplete="off"
              maxLength={200}
              placeholder="What if I buy an electric scooter?"
              className={cn(
                "w-full rounded-2xl border border-slate-700/50 bg-surface-2/70 py-4 pl-10 pr-24 font-mono text-sm text-slate-100 placeholder-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                warn && "border-red-500/50",
              )}
              aria-describedby="wi-count wi-error"
              {...form.register("query")}
            />
            <span
              id="wi-count"
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs",
                warn ? "text-red-400" : "text-slate-500",
              )}
              role="status"
              aria-live="polite"
            >
              {query?.length ?? 0}/200
            </span>
          </div>

          <div id="wi-error" className="mt-3 text-sm text-red-300" role="alert">
            {form.formState.errors.query?.message ?? null}
          </div>

          <div
            className="mt-5 flex flex-wrap gap-2"
            role="group"
            aria-label="Quick what-if suggestions"
          >
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  form.setValue("query", s, { shouldValidate: true, shouldDirty: true });
                  setResult(null);
                  setApplied(false);
                }}
                className="rounded-full border border-slate-700/50 bg-surface-2/80 px-3 py-1 font-mono text-[0.7rem] font-bold uppercase tracking-wider text-slate-400 hover:border-brand/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                {s.replace("What if I ", "").replace("?", "")}
              </button>
            ))}
          </div>

          <Button
            type="submit"
            className="mt-6 w-full rounded-2xl py-6"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
          >
            {form.formState.isSubmitting ? "Simulating…" : "Simulate"}
          </Button>

          {result ? (
            <div
              className="mt-6 rounded-2xl border border-brand/20 bg-surface-2/60 p-5"
              role="region"
              aria-live="polite"
              aria-label="Simulation result"
            >
              <div className="mb-5 flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100">
                  Simulation Complete
                </span>
                <span className="ml-auto rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 font-mono text-[0.7rem] font-bold uppercase tracking-wider text-blue-300">
                  {result.cat}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-brand/10 bg-slate-900/70 p-3 text-center">
                  <div className="mb-1.5 text-xs text-slate-400">CO₂ saved/mo</div>
                  <div className="font-mono text-lg font-bold text-brand">
                    {result.co2}
                  </div>
                </div>
                <div className="rounded-2xl border border-green-500/10 bg-slate-900/70 p-3 text-center">
                  <div className="mb-1.5 text-xs text-slate-400">Cost saved/mo</div>
                  <div className="font-mono text-lg font-bold text-green-400">
                    {result.cost}
                  </div>
                </div>
                <div className="rounded-2xl border border-yellow-500/10 bg-slate-900/70 p-3 text-center">
                  <div className="mb-1.5 text-xs text-slate-400">Break-even</div>
                  <div className="font-mono text-lg font-bold text-yellow-400">
                    {result.be}
                  </div>
                </div>
              </div>

              <Button
                type="button"
                className="mt-4 w-full rounded-xl"
                variant={applied ? "default" : "outline"}
                onClick={() => {
                  setApplied(true);
                  pushToast({
                    title: "Profile updated",
                    description: "This change has been applied to your profile (demo).",
                    variant: "success",
                  });
                }}
                disabled={applied}
              >
                {applied ? "Profile updated ✓" : "Apply this change to my profile →"}
              </Button>
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
