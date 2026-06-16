"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

import { Card, CardContent } from "@/components/ui/card";
import { EVALUATION_DIMENSIONS } from "@/constants/evaluation";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

/**
 * RadarChart — multi-dimension quality comparison.
 * Renders a spider/radar chart using Chart.js + react-chartjs-2.
 * Note: dimension values are illustrative demo data (see evaluation.ts).
 */
export function RadarChart() {
  const labels = EVALUATION_DIMENSIONS.map((d) => d.label);
  const values = EVALUATION_DIMENSIONS.map((d) => d.value);

  const data = {
    labels,
    datasets: [
      {
        label: "Your Project",
        data: values,
        backgroundColor: "rgba(34,197,94,0.12)",
        borderColor: "rgba(34,197,94,0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(34,197,94,1)",
        pointBorderColor: "#020617",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
      {
        label: "Industry Avg",
        data: [72, 69, 71, 74, 68, 70],
        backgroundColor: "rgba(148,163,184,0.06)",
        borderColor: "rgba(148,163,184,0.4)",
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointBackgroundColor: "rgba(148,163,184,0.6)",
        pointBorderColor: "#020617",
        pointBorderWidth: 1,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#94a3b8",
          font: { family: "var(--font-fira-code)", size: 11 },
          padding: 16,
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        borderColor: "rgba(34,197,94,0.3)",
        borderWidth: 1,
        titleColor: "#94a3b8",
        bodyColor: "#22c55e",
        padding: 10,
        callbacks: {
          label: (ctx: { dataset: { label?: string }; raw: unknown }) =>
            ` ${ctx.dataset.label ?? ""}: ${String(ctx.raw)}/100`,
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          color: "#475569",
          backdropColor: "transparent",
          font: { size: 9 },
        },
        grid: { color: "rgba(148,163,184,0.08)" },
        angleLines: { color: "rgba(148,163,184,0.08)" },
        pointLabels: {
          color: "#94a3b8",
          font: { family: "var(--font-fira-code)", size: 10 },
        },
      },
    },
  };

  return (
    <Card className="border-white/5">
      <CardContent className="p-5">
        <h3 className="mb-1 text-sm font-semibold text-slate-100">Quality Radar</h3>
        <p className="mb-4 text-xs text-slate-500">
          Your project vs industry average across all 6 dimensions
        </p>
        <div
          role="img"
          aria-label="Radar chart showing quality scores across 6 dimensions"
        >
          <Radar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
