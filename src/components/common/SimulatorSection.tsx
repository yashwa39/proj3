"use client";

import * as React from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { SIMULATOR } from "@/lib/carbonMirrorData";
import { cn } from "@/lib/utils";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function SimulatorSection() {
  const [timelineIdx, setTimelineIdx] = React.useState(1);
  const [idxForChart, setIdxForChart] = React.useState(1);
  const debouncedSet = useDebouncedCallback((i: number) => setIdxForChart(i), 80);

  const timeline = SIMULATOR.timelines[timelineIdx];
  const chartTimeline = SIMULATOR.timelines[idxForChart];

  const pct = timelineIdx * 50;

  const chartData = React.useMemo(
    () => ({
      labels: ["Current Path", "Better Path", "Green Path"],
      datasets: [
        {
          label: "CO₂ (kg)",
          data: chartTimeline.raw,
          backgroundColor: [
            "rgba(239,68,68,.25)",
            "rgba(234,179,8,.25)",
            "rgba(34,197,94,.25)",
          ],
          borderColor: ["rgba(239,68,68,.8)", "rgba(234,179,8,.8)", "rgba(34,197,94,.8)"],
          borderWidth: 2,
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    }),
    [chartTimeline.raw],
  );

  return (
    <section id="simulator" className="py-28" aria-label="Future Simulator">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-14 text-center">
          <span className="mb-3 block font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-brand/90">
            Feature 01
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Future <span className="text-brand">Simulator</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Move the slider. Watch three futures collide in real time.
          </p>
        </div>

        <Card className="border-brand/15 bg-surface/75">
          <CardContent className="p-6 md:p-10">
            <div className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <label htmlFor="sim-slider" className="font-mono text-sm text-slate-400">
                  Timeline Projection
                </label>
                <span
                  className="font-mono text-xl font-bold text-brand"
                  role="status"
                  aria-live="polite"
                  aria-label="Selected timeline"
                >
                  {timeline.label}
                </span>
              </div>
              <input
                id="sim-slider"
                type="range"
                min={0}
                max={2}
                step={1}
                value={timelineIdx}
                onChange={(e) => {
                  const next = Number.parseInt(e.target.value, 10);
                  setTimelineIdx(next);
                  debouncedSet(next);
                }}
                aria-label="Select timeline projection"
                aria-valuemin={0}
                aria-valuemax={2}
                aria-valuenow={timelineIdx}
                aria-valuetext={timeline.label}
                style={{
                  background: `linear-gradient(to right,#22C55E ${pct}%,#1e293b ${pct}%)`,
                }}
                className="h-[6px] w-full cursor-pointer appearance-none rounded-full outline-none"
              />
              <div
                className="mt-2 flex justify-between font-mono text-xs text-slate-400"
                aria-hidden="true"
              >
                <span>1 year</span>
                <span>5 years</span>
                <span>10 years</span>
              </div>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <ScenarioCard
                title="Current Path"
                dotClassName="bg-red-500"
                borderClassName="border-red-500/40 bg-red-500/[0.04]"
                co2={timeline.cur.co2}
                cost={timeline.cur.cost}
                trees={timeline.cur.trees}
              />
              <ScenarioCard
                title="Better Path"
                dotClassName="bg-yellow-400"
                borderClassName="border-yellow-400/40 bg-yellow-400/[0.04]"
                co2={timeline.better.co2}
                cost={timeline.better.cost}
                trees={timeline.better.trees}
                badge={<Badge variant="warning">−30% vs Current</Badge>}
              />
              <ScenarioCard
                title="Green Path"
                dotClassName="bg-brand"
                borderClassName="border-brand/40 bg-brand/[0.04]"
                co2={timeline.green.co2}
                cost={timeline.green.cost}
                trees={timeline.green.trees}
                badge={<Badge>−70% vs Current</Badge>}
              />
            </div>

            <div className="rounded-2xl border border-white/5 bg-surface/50 p-4">
              <p id="sim-chart-desc" className="sr-only">
                Bar chart comparing CO₂ emissions across Current Path, Better Path, and
                Green Path for the selected timeline.
              </p>
              <Bar
                aria-describedby="sim-chart-desc"
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: "#0f172a",
                      borderColor: "rgba(34,197,94,.3)",
                      borderWidth: 1,
                      titleColor: "#94a3b8",
                      bodyColor: "#22c55e",
                      bodyFont: { family: "var(--font-fira-code)", size: 13 },
                      padding: 10,
                    },
                  },
                  scales: {
                    x: {
                      grid: { color: "rgba(255,255,255,.04)" },
                      ticks: {
                        color: "#94a3b8",
                        font: { family: "var(--font-fira-code)", size: 11 },
                      },
                    },
                    y: {
                      grid: { color: "rgba(255,255,255,.04)" },
                      ticks: {
                        color: "#94a3b8",
                        font: { family: "var(--font-fira-code)", size: 11 },
                      },
                      beginAtZero: true,
                    },
                  },
                  animation: { duration: 400 },
                }}
                data={chartData}
                role="img"
              />
            </div>

            <p className="mt-4 text-center font-mono text-xs text-slate-500">
              * Green Path assumes uncommitted lifestyle changes. Results based on IPCC
              AR6 emission factors.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ScenarioCard(props: {
  title: string;
  dotClassName: string;
  borderClassName: string;
  co2: string;
  cost: string;
  trees: string;
  badge?: React.ReactNode;
}) {
  return (
    <div
      className={cn("rounded-2xl border p-5", props.borderClassName)}
      role="article"
      aria-label={`${props.title} projection`}
    >
      <div className="mb-4 flex items-center gap-2">
        <div
          className={cn("h-3 w-3 rounded-full", props.dotClassName)}
          aria-hidden="true"
        />
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
          {props.title}
        </span>
      </div>
      <div className="space-y-4">
        <div>
          <div className="mb-1 text-xs text-slate-400">CO₂ Emissions</div>
          <div
            className="font-mono text-2xl font-bold text-slate-100"
            role="status"
            aria-live="polite"
          >
            {props.co2}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl border border-white/5 bg-black/10 p-2.5">
            <div className="mb-0.5 text-slate-400">Cost</div>
            <div className="font-mono font-semibold text-slate-200">{props.cost}</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-black/10 p-2.5">
            <div className="mb-0.5 text-slate-400">Trees</div>
            <div className="font-mono font-semibold text-slate-200">{props.trees}</div>
          </div>
        </div>
        {props.badge ? <div>{props.badge}</div> : null}
      </div>
    </div>
  );
}
