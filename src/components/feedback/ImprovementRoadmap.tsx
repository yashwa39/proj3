import { Card, CardContent } from "@/components/ui/card";

export function ImprovementRoadmap({ phases }: { phases: string[] }) {
  return (
    <Card className="border-white/5">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-slate-100">Improvement Roadmap</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-400">
          {phases.map((phase) => (
            <li key={phase}>{phase}</li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
