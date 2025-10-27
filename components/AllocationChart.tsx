"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";

import type { PortfolioMetrics } from "@/hooks/usePortfolioMetrics";
import { formatCurrency, formatPercent } from "@/lib/format";

const COLORS = ["#6366f1", "#22d3ee", "#f97316", "#a855f7", "#22c55e", "#facc15"];

interface AllocationChartProps {
  metrics: PortfolioMetrics;
}

export function AllocationChart({ metrics }: AllocationChartProps) {
  const data = metrics.allocations.map((allocation) => ({
    name: allocation.label,
    value: allocation.value,
    percentage: allocation.percentage
  }));

  return (
    <section className="glass-panel flex flex-col gap-6 rounded-3xl p-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-100">Allocation by thesis</h2>
        <p className="text-sm text-slate-400">
          Understand category exposure to manage diversification, liquidity, and drawdown risk.
        </p>
      </header>
      <div className="h-72">
        {data.length ? (
          <ResponsiveContainer>
            <PieChart>
              <Pie dataKey="value" data={data} innerRadius={70} outerRadius={110} paddingAngle={4}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  borderRadius: "12px",
                  color: "#e2e8f0"
                }}
                formatter={(value: number, _, entry) => {
                  const percent = (entry.payload as { percentage: number }).percentage;
                  return [formatCurrency(value), `${formatPercent(percent)} share`];
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-slate-300">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Add holdings to visualize your allocations.
          </div>
        )}
      </div>
    </section>
  );
}
