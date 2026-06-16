import { cn } from "@/lib/utils";

export function SectionHeading({
  label,
  title,
  description,
  accentClassName,
}: {
  label: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  accentClassName?: string;
}) {
  return (
    <div className="mb-14 text-center">
      <span
        className={cn(
          "mb-3 block font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-brand/90",
          accentClassName,
        )}
      >
        {label}
      </span>
      <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h2>
      {description ? (
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400 md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
