"use client";

import * as React from "react";
import { RefreshCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useChallengesStore } from "@/store/challengesStore";

function difficultyVariant(diff: string): React.ComponentProps<typeof Badge>["variant"] {
  if (diff === "Easy") return "default";
  if (diff === "Medium") return "warning";
  return "danger";
}

export function ChallengesSection() {
  const items = useChallengesStore((s) => s.items);
  const refreshing = useChallengesStore((s) => s.refreshing);
  const total = useChallengesStore((s) => s.totalSavedKg());
  const complete = useChallengesStore((s) => s.complete);
  const refresh = useChallengesStore((s) => s.refresh);

  return (
    <section aria-label="AI Carbon Challenges" className="py-10">
      <Card className="border-white/5">
        <CardContent className="p-8">
          <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-purple-300/90">
            Feature 04
          </span>
          <h3 className="mt-3 text-2xl font-extrabold tracking-tight">
            AI Carbon <span className="text-purple-400">Challenges</span>
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Custom missions built for your persona — student, commuter, or office worker.
          </p>

          <div className="mt-6 space-y-3" role="list" aria-label="Active challenges">
            {items.map((c, idx) => (
              <div
                key={c.label}
                role="listitem"
                tabIndex={0}
                onClick={() => complete(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    complete(idx);
                  }
                }}
                className={[
                  "group cursor-pointer rounded-xl border p-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  c.done
                    ? "border-brand/20 bg-brand/5 opacity-70"
                    : "border-slate-700/40 bg-surface-2/50 hover:border-purple-400/30",
                ].join(" ")}
                aria-label={`${c.label}${c.done ? " — completed" : ""}`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant={difficultyVariant(c.difficulty)}>{c.difficulty}</Badge>
                  <span className="font-mono text-xs font-bold text-slate-300">
                    {c.pointsLabel}
                  </span>
                </div>
                <div className="mb-1 text-sm font-semibold text-slate-200">{c.label}</div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Saves <span className="text-slate-200">{c.savesLabel}</span>
                  </span>
                  {c.done ? (
                    <span className="font-mono font-bold text-brand">✓ Done</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              Total saved:{" "}
              <span className="font-mono font-bold text-brand">{total} kg CO₂</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refresh()}
              disabled={refreshing}
            >
              <RefreshCcw
                className={["h-3.5 w-3.5", refreshing ? "animate-spin" : ""].join(" ")}
                aria-hidden="true"
              />
              {refreshing ? "Refreshing…" : "Refresh"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
