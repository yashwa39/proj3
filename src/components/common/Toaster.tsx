"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/toastStore";

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      aria-live="polite"
      aria-relevant="additions text"
      className="fixed right-4 top-4 z-[100] flex w-[min(420px,calc(100%-2rem))] flex-col gap-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "rounded-2xl border bg-surface/85 p-4 shadow-2xl backdrop-blur-xl",
            t.variant === "success" && "border-brand/30",
            t.variant === "error" && "border-red-500/30",
          )}
          role="status"
        >
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-slate-100">{t.title}</div>
              {t.description ? (
                <div className="mt-1 text-sm text-slate-400">{t.description}</div>
              ) : null}
            </div>
            <button
              className="rounded-lg p-1.5 text-slate-300 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
