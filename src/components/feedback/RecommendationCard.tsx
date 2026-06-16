import { Card, CardContent } from "@/components/ui/card";
import type { Recommendation } from "@/types";

export function RecommendationCard({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  return (
    <Card className="border-white/5">
      <CardContent className="p-5">
        <div className="text-sm font-semibold text-slate-100">{recommendation.title}</div>
        <div className="mt-1 text-xs uppercase tracking-wide text-slate-400">
          Severity: {recommendation.severity}
        </div>
        <p className="mt-2 text-sm text-slate-400">{recommendation.howToImprove}</p>
      </CardContent>
    </Card>
  );
}
