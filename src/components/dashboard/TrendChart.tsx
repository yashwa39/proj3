"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { Card, CardContent } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

/** Simulated 8-week score history for demonstration purposes. */
const WEEKS = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8"];
const OVERALL_TREND = [61, 65, 68, 72, 77, 82, 88, 92];
const SECURITY_TREND = [48, 54, 60, 68, 74, 80, 88, 91];

/**
 * TrendChart — animated line chart showing score progression over 8 weeks.
 * Values are illustrative demo data; replace with API-backed history.
 */
export function TrendChart() {
  const data = {
    labels: WEEKS,
    datasets: [
      {
        label: "Overall",
        data: OVERALL_TREND,
        borderColor: "rgba(34,197,94,0.9)",
        backgroundColor: "rgba(34,197,94,0.08)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgba(34,197,94,1)",
        pointBorderColor: "#020617",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Security",
        data: SECURITY_TREND,
        borderColor: "rgba(99,102,241,0.8)",
        backgroundColor: "rgba(99,102,241,0.04)",
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        borderDash: [5, 3],
        pointBackgroundColor: "rgba(99,102,241,0.9)",
        pointBorderColor: "#020617",
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: { mode: "index" as const, intersect: false },
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
        bodyColor: "#f1f5f9",
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(148,163,184,0.05)" },
        ticks: {
          color: "#64748b",
          font: { family: "var(--font-fira-code)", size: 10 },
        },
      },
      y: {
        min: 40,
        max: 100,
        grid: { color: "rgba(148,163,184,0.06)" },
        ticks: {
          color: "#64748b",
          font: { family: "var(--font-fira-code)", size: 10 },
          stepSize: 20,
        },
      },
    },
  };

  return (
    <Card className="border-white/5">
      <CardContent className="p-5">
        <h3 className="mb-1 text-sm font-semibold text-slate-100">Score Trend</h3>
        <p className="mb-4 text-xs text-slate-500">
          8-week progression — illustrative demo data
        </p>
        <div
          role="img"
          aria-label="Line chart showing overall and security score trends over 8 weeks"
        >
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
