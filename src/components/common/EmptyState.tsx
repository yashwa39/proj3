export function EmptyState({
  title = "No data yet",
  description = "Try changing filters or creating a new item.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-surface/60 p-6 text-center">
      <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  );
}
