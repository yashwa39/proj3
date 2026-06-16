import { Card, CardContent } from "@/components/ui/card";

export function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border-white/5">
      <CardContent className="p-5">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="mt-1 font-mono text-3xl font-extrabold text-brand">{value}</div>
      </CardContent>
    </Card>
  );
}
