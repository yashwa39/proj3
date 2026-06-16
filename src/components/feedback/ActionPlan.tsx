import { Card, CardContent } from "@/components/ui/card";

export function ActionPlan({ items }: { items: string[] }) {
  return (
    <Card className="border-white/5">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-slate-100">Action Plan</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-400">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
