"use client";

import * as React from "react";

import { ShareEcoHackInlineForm } from "@/components/forms/ShareEcoHackInlineForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSocialStore } from "@/store/socialStore";

function formatKg(value: number) {
  return (
    value.toLocaleString("en-IN", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) + " kg"
  );
}

const TAG_VARIANT: Record<string, React.ComponentProps<typeof Badge>["variant"]> = {
  Transport: "default",
  Energy: "info",
  Diet: "warning",
  Shopping: "subtle",
  Other: "subtle",
};

export function SocialSection() {
  const posts = useSocialStore((s) => s.posts);
  const adopt = useSocialStore((s) => s.adopt);
  const totalKg = useSocialStore((s) => s.getCommunityTotalKg());
  const topRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <section id="social" className="py-28" aria-label="Social Carbon Swap">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-14 text-center">
          <span className="mb-3 block font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-pink-300/90">
            Feature 07
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Social <span className="text-pink-400">Carbon Swap</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Your eco-hack could inspire thousands. Share it. Measure the collective
            impact.
          </p>
        </div>

        <Card className="mb-7 border-white/5">
          <CardContent className="flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/20 bg-brand/10"
                aria-hidden="true"
              >
                <div className="h-5 w-5 rounded-full bg-brand/30" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-100">Community Impact</div>
                <div className="text-xs text-slate-400">
                  Updated in real time · <span className="text-brand">2,847 members</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div
                className="font-mono text-3xl font-extrabold text-brand"
                role="status"
                aria-live="polite"
              >
                {formatKg(totalKg)}
              </div>
              <div className="text-xs text-slate-400">kg CO₂ saved together</div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <ShareEcoHackInlineForm
            onShared={() => {
              // Make it extremely obvious: jump user to the top of the feed.
              requestAnimationFrame(() =>
                topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
              );
            }}
          />
        </div>

        <div ref={topRef} />
        <div className="space-y-4" role="feed" aria-label="Community eco-hacks feed">
          {posts.map((post, idx) => (
            <article
              key={`${post.user}-${idx}`}
              className="rounded-2xl border border-white/5 bg-surface/70 p-5 backdrop-blur-xl"
              aria-label={`Eco-hack post by ${post.user}`}
            >
              <div className="mb-3 flex items-start gap-3">
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-green-600 text-sm font-bold text-white"
                  aria-hidden="true"
                >
                  {post.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-100">{post.user}</span>
                    <Badge variant={TAG_VARIANT[post.tag] ?? "subtle"}>{post.tag}</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400">{post.text}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="font-mono font-bold text-brand">
                    −{post.savesKgPerMonth} kg CO₂/mo
                  </span>
                  <span>· {post.adoptedCount} adopted</span>
                </div>
                <Button
                  size="sm"
                  variant={post.adopted ? "default" : "outline"}
                  disabled={post.adopted}
                  onClick={() => adopt(idx)}
                  aria-label={
                    post.adopted
                      ? "Hack already adopted"
                      : `Adopt this eco-hack by ${post.user}`
                  }
                >
                  {post.adopted ? "✓ Adopted" : "Adopt this hack"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
