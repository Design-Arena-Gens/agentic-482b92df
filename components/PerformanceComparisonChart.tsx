"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import type { EnrichedHolding } from "@/types/portfolio";
import { formatCurrency } from "@/lib/format";

interface PerformanceComparisonChartProps {
  holdings: EnrichedHolding[];
}

export function PerformanceComparisonChart({ holdings }: PerformanceComparisonChartProps) {
  const data = holdings.map((holding) => ({
    name: holding.symbol,
    marketValue: Number(holding.marketValue.toFixed(2)),
    costBasis: Number(holding.costBasis.toFixed(2))
  }));

  return (
    <section className="glass-panel flex flex-col gap-6 rounded-3xl p-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-slate-100">Value vs. Cost Basis</h2>
        <p className="text-sm text-slate-400">
          Benchmark unrealized returns and quickly identify positions diverging from thesis.
        </p>
      </header>
      <div className="h-72">
        {data.length ? (
          <ResponsiveContainer>
            <ComposedChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis
                stroke="#94a3b8"
                tickFormatter={(value) => formatCurrency(value as number, { maximumFractionDigits: 0 })}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  borderRadius: "12px",
                  color: "#e2e8f0"
                }}
                formatter={(value) => formatCurrency(value as number)}
              />
              <Legend wrapperStyle={{ color: "#cbd5f5" }} />
              <Bar dataKey="costBasis" name="Cost Basis" fill="#6366f1" radius={[12, 12, 12, 12]} />
              <Bar dataKey="marketValue" name="Market Value" fill="#22d3ee" radius={[12, 12, 12, 12]} />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Log holdings to generate comparative analytics.
          </div>
        )}
      </div>
    </section>
  );
}
