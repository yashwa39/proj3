import { OVERALL_SCORE, EVALUATION_DIMENSIONS } from "@/constants/evaluation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { RadarChart } from "@/components/dashboard/RadarChart";
import { SubmissionCard } from "@/components/dashboard/SubmissionCard";
import { IssueSummary } from "@/components/feedback/IssueSummary";
import { ActionPlan } from "@/components/feedback/ActionPlan";
import { ImprovementRoadmap } from "@/components/feedback/ImprovementRoadmap";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
        Evaluation Dashboard
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        Actionable quality intelligence with root-cause and next-step guidance.
      </p>

      <div className="mt-6">
        <DashboardLayout>
          <div className="space-y-4">
            <ScoreCard label="Overall Score" value={OVERALL_SCORE} />

            <div className="grid gap-4 md:grid-cols-2">
              <TrendChart />
              <RadarChart />
            </div>

            <AnalyticsPanel />

            <div className="grid gap-4 md:grid-cols-2">
              <IssueSummary summary="Primary gap is execution consistency: testing and security improved significantly, but architectural cleanup of non-product assets remains." />
              <ActionPlan
                items={[
                  "Archive or remove non-production artifacts.",
                  "Expand integration tests for all major forms.",
                  "Add telemetry for runtime error and UX friction points.",
                ]}
              />
            </div>

            <ImprovementRoadmap
              phases={[
                "Stabilize: enforce CI gates and eliminate flaky tests.",
                "Optimize: split large sections and improve progressive loading.",
                "Scale: add role-based auth and API-backed persistence.",
              ]}
            />

            <div className="grid gap-4 md:grid-cols-3">
              {EVALUATION_DIMENSIONS.slice(0, 3).map((item) => (
                <SubmissionCard
                  key={item.key}
                  title={`${item.label} Review`}
                  status="processed"
                  submittedAt={new Date().toLocaleString()}
                />
              ))}
            </div>
          </div>
        </DashboardLayout>
      </div>
    </main>
  );
}
