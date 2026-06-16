import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-white/5">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </CardContent>
    </Card>
  );
}
