import { Card, CardContent } from "@/components/ui/card";

export function SubmissionCard({
  title,
  status,
  submittedAt,
}: {
  title: string;
  status: "pending" | "processed" | "failed";
  submittedAt: string;
}) {
  const statusColor =
    status === "processed"
      ? "text-brand"
      : status === "failed"
        ? "text-red-300"
        : "text-yellow-300";

  return (
    <Card className="border-white/5">
      <CardContent className="p-5">
        <div className="text-sm font-semibold text-slate-100">{title}</div>
        <div className={`mt-1 font-mono text-xs ${statusColor}`}>{status}</div>
        <div className="mt-2 text-xs text-slate-400">{submittedAt}</div>
      </CardContent>
    </Card>
  );
}
