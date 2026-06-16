import { Card, CardContent } from "@/components/ui/card";

export function IssueSummary({ summary }: { summary: string }) {
  return (
    <Card className="border-white/5">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-slate-100">Issue Summary</h3>
        <p className="mt-2 text-sm text-slate-400">{summary}</p>
      </CardContent>
    </Card>
  );
}
