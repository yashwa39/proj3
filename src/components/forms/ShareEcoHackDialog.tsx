"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toPlainText } from "@/lib/sanitize";
import { useSocialStore } from "@/store/socialStore";
import { useToastStore } from "@/store/toastStore";
import {
  shareEcoHackSchema,
  type ShareEcoHackFormValues,
} from "@/validations/shareEcoHack";

export function ShareEcoHackDialog() {
  const pushToast = useToastStore((s) => s.push);
  const addPost = useSocialStore((s) => s.addPost);
  const [open, setOpen] = React.useState(false);

  const form = useForm<ShareEcoHackFormValues>({
    resolver: zodResolver(
      shareEcoHackSchema,
    ) as unknown as Resolver<ShareEcoHackFormValues>,
    defaultValues: { description: "", category: "Transport", savingsKg: 1 },
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
      title: "Eco-hack shared",
      description: "Thanks for contributing to the community.",
      variant: "success",
    });
    form.reset({
      description: "",
      category: values.category,
      savingsKg: values.savingsKg,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mx-auto rounded-2xl border-brand/20 text-brand hover:bg-brand hover:text-white"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Share Your Eco-Hack
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Eco-Hack</DialogTitle>
          <DialogDescription>
            Share a small change that saves carbon. Your post is plain-text only.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="hack-desc"
              className="mb-1.5 block text-sm font-semibold text-slate-300"
            >
              Eco-hack description <span className="text-red-300">*</span>
            </label>
            <textarea
              id="hack-desc"
              rows={3}
              maxLength={300}
              className="w-full resize-none rounded-xl border border-slate-700/50 bg-surface-2/70 p-3 text-sm text-slate-100 placeholder-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              placeholder="Describe your eco-hack (1–300 characters)…"
              aria-invalid={!!form.formState.errors.description}
              {...form.register("description")}
            />
            <div className="mt-1 text-right font-mono text-xs text-slate-500">
              {form.watch("description")?.length ?? 0}/300
            </div>
            {form.formState.errors.description?.message ? (
              <p className="text-sm text-red-300" role="alert">
                {form.formState.errors.description.message}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="hack-category"
                className="mb-1.5 block text-sm font-semibold text-slate-300"
              >
                Category <span className="text-red-300">*</span>
              </label>
              <select
                id="hack-category"
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
                <p className="text-sm text-red-300" role="alert">
                  {form.formState.errors.category.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="hack-savings"
                className="mb-1.5 block text-sm font-semibold text-slate-300"
              >
                Monthly CO₂ savings (kg) <span className="text-red-300">*</span>
              </label>
              <input
                id="hack-savings"
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
                <p className="text-sm text-red-300" role="alert">
                  {form.formState.errors.savingsKg.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Share Hack
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
