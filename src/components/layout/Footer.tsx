import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/50 py-8" role="contentinfo">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-slate-500 md:flex-row">
        <div className="flex items-center gap-2">
          <div
            className="flex h-5 w-5 items-center justify-center rounded-lg border border-brand/20 bg-brand/10"
            aria-hidden="true"
          >
            <div className="h-2 w-2 rounded-full bg-brand" />
          </div>
          <span className="font-mono font-bold text-slate-400">
            Carbon<span className="text-brand">Mirror</span>
          </span>
          <span>© {new Date().getFullYear()}</span>
        </div>

        <span className="hidden font-mono text-slate-500 md:block">
          Code Quality · Security · Efficiency · Testing · Accessibility · Problem
          Alignment
        </span>

        <nav className="flex gap-4" aria-label="Footer navigation">
          <Link
            href="#"
            className="rounded hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            rel="noopener noreferrer"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="rounded hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            rel="noopener noreferrer"
          >
            Terms
          </Link>
          <Link
            href="#"
            className="rounded hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            rel="noopener noreferrer"
          >
            Contact
          </Link>
          <Link
            href="#methodology"
            className="rounded text-brand/80 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Methodology
          </Link>
        </nav>
      </div>
    </footer>
  );
}
