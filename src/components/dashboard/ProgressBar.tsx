import { Progress } from "@/components/ui/progress";

export function ProgressBar({ value }: { value: number }) {
  return <Progress value={Math.max(0, Math.min(100, value))} />;
}
