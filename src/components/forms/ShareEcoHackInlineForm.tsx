"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toPlainText } from "@/lib/sanitize";
import { useSocialStore } from "@/store/socialStore";
import { useToastStore } from "@/store/toastStore";
import {
  shareEcoHackSchema,
  type ShareEcoHackFormValues,
} from "@/validations/shareEcoHack";

export function ShareEcoHackInlineForm({ onShared }: { onShared?: () => void }) {
  const pushToast = useToastStore((s) => s.push);
  const addPost = useSocialStore((s) => s.addPost);

  const form = useForm<ShareEcoHackFormValues>({
    resolver: zodResolver(
      shareEcoHackSchema,
    ) as unknown as Resolver<ShareEcoHackFormValues>,
    defaultValues: { description: "", category: "Other", savingsKg: 1 },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<ShareEcoHackFormValues> = (values) => {
    addPost({
      user: "@you",
      initial: "Y",
      tag: values.category,
      text: toPlainText(values.description),
      savesKgPerMonth: values.savingsKg,
    });

    pushToast({
      title: "Shared",
      description: "Your eco-hack was added to the feed.",
      variant: "success",
    });

    form.reset({
      description: "",
      category: values.category,
      savingsKg: values.savingsKg,
    });
    onShared?.();
  };

  const desc = form.watch("description") ?? "";

  return (
    <Card className="border-white/5">
      <CardContent className="p-5">
        <div className="mb-4">
          <div className="text-sm font-bold text-slate-100">Share an eco-hack</div>
          <div className="mt-1 text-xs text-slate-400">
            Keep it short. It’ll appear immediately at the top of the feed.
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-3">
          <div>
            <label htmlFor="share-desc" className="sr-only">
              Eco-hack description
            </label>
            <textarea
              id="share-desc"
              rows={3}
              maxLength={300}
              className="w-full resize-none rounded-xl border border-slate-700/50 bg-surface-2/70 p-3 text-sm text-slate-100 placeholder-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              placeholder="Example: I walk 2km instead of taking a cab twice a week."
              aria-invalid={!!form.formState.errors.description}
              aria-describedby="share-desc-count share-desc-error"
              {...form.register("description")}
            />
            <div className="mt-1 flex items-center justify-between">
              <p id="share-desc-error" className="text-sm text-red-300" role="alert">
                {form.formState.errors.description?.message ?? null}
              </p>
              <div
                id="share-desc-count"
                className="text-right font-mono text-xs text-slate-500"
                aria-live="polite"
              >
                {desc.length}/300
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="share-category"
                className="mb-1.5 block text-xs font-semibold text-slate-300"
              >
                Category
              </label>
              <select
                id="share-category"
                className="w-full rounded-xl border border-slate-700/50 bg-surface-2/70 p-3 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                aria-invalid={!!form.formState.errors.category}
                {...form.register("category")}
              >
                <option value="Transport">Transport</option>
                <option value="Energy">Energy</option>
                <option value="Diet">Diet</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
              {form.formState.errors.category?.message ? (
                <p className="mt-1 text-sm text-red-300" role="alert">
                  {form.formState.errors.category.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="share-savings"
                className="mb-1.5 block text-xs font-semibold text-slate-300"
              >
                CO₂ saved / month (kg)
              </label>
              <input
                id="share-savings"
                type="number"
                inputMode="decimal"
                min={0.01}
                max={500}
                step={0.01}
                className="w-full rounded-xl border border-slate-700/50 bg-surface-2/70 p-3 font-mono text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                aria-invalid={!!form.formState.errors.savingsKg}
                {...form.register("savingsKg", { valueAsNumber: true })}
              />
              {form.formState.errors.savingsKg?.message ? (
                <p className="mt-1 text-sm text-red-300" role="alert">
                  {form.formState.errors.savingsKg.message}
                </p>
              ) : null}
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Send className="h-4 w-4" aria-hidden="true" />
            Share
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
