export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-4">
      <div
        role="status"
        aria-live="polite"
        className="rounded-3xl border border-white/5 bg-surface/70 p-8 text-center backdrop-blur-xl"
      >
        <div
          className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand/30 border-t-brand"
          aria-hidden="true"
        />
        <div className="mt-4 text-sm font-semibold text-slate-100">Loading…</div>
        <div className="mt-1 text-sm text-slate-400">
          Preparing your climate insights.
        </div>
      </div>
    </div>
  );
}
