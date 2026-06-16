import { EVALUATION_DIMENSIONS } from "@/constants/evaluation";
import { EvaluationCard } from "@/components/dashboard/EvaluationCard";

export function AnalyticsPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {EVALUATION_DIMENSIONS.map((dimension) => (
        <EvaluationCard
          key={dimension.key}
          title={dimension.label}
          score={dimension.value}
          reason={dimension.meaning}
        />
      ))}
    </div>
  );
}
