import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/dashboard/ProgressBar";

export function EvaluationCard({
  title,
  score,
  reason,
}: {
  title: string;
  score: number;
  reason: string;
}) {
  return (
    <Card className="border-white/5">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
          <span className="font-mono text-sm font-bold text-brand">{score}</span>
        </div>
        <div className="mt-3">
          <ProgressBar value={score} />
        </div>
        <p className="mt-3 text-sm text-slate-400">{reason}</p>
      </CardContent>
    </Card>
  );
}
