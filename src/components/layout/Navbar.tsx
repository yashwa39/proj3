"use client";

import Link from "next/link";
import * as React from "react";
import { Menu, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "#problem", label: "Problem" },
  { href: "#simulator", label: "Simulator" },
  { href: "#features", label: "Features" },
  { href: "#avatar", label: "Avatar" },
  { href: "#social", label: "Community" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        "fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 transition-transform duration-300",
        scrolled && "scale-[.99]",
      )}
    >
      <div
        className={cn(
          "rounded-2xl border border-brand/15 bg-surface/70 px-5 py-3 backdrop-blur-xl transition-shadow duration-300",
          scrolled && "shadow-2xl shadow-black/40",
        )}
      >
        <div className="flex items-center justify-between">
          <Link
            href="#"
            aria-label="CarbonMirror home"
            className="group flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 transition-colors group-hover:bg-brand/20">
              <Zap className="h-4 w-4 text-brand" aria-hidden="true" />
            </div>
            <span className="font-mono text-sm font-bold tracking-tight text-white">
              Carbon<span className="text-brand">Mirror</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-1.5 text-sm text-slate-400 transition-all hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a href="#download" className="hidden sm:block">
              <Button size="sm" className="rounded-xl px-4">
                Get App
              </Button>
            </a>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogTitle className="sr-only">Navigation menu</DialogTitle>
                <div className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </nav>
  );
}
