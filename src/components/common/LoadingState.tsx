export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-white/5 bg-surface/60 p-6 text-center"
    >
      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
      <p className="mt-3 text-sm text-slate-300">{label}</p>
    </div>
  );
}
