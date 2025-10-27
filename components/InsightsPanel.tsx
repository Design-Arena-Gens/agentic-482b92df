"use client";

import { ArrowTrendingUpIcon, LightBulbIcon } from "@heroicons/react/24/outline";

import type { PortfolioMetrics } from "@/hooks/usePortfolioMetrics";
import { formatCurrency, formatPercent } from "@/lib/format";

interface InsightsPanelProps {
  metrics: PortfolioMetrics;
}

export function InsightsPanel({ metrics }: InsightsPanelProps) {
  return (
    <section className="glass-panel flex flex-col gap-4 rounded-3xl p-6">
      <header className="flex items-center gap-3">
        <LightBulbIcon className="h-6 w-6 text-accent" />
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Insights to action</h2>
          <p className="text-sm text-slate-400">Surface narratives shaping your current allocations.</p>
        </div>
      </header>
      <ul className="flex flex-col gap-4 text-sm text-slate-300">
        {metrics.topPerformer && (
          <li className="rounded-2xl border border-positive/20 bg-positive/10 px-4 py-3">
            <div className="flex items-center gap-2 text-positive">
              <ArrowTrendingUpIcon className="h-5 w-5" />
              <span className="font-semibold">{metrics.topPerformer.name}</span>
              <span className="text-xs uppercase tracking-[0.3em]">{metrics.topPerformer.symbol}</span>
            </div>
            <p className="mt-2 text-sm text-positive/90">
              Leading performer with {formatPercent(metrics.topPerformer.gainLossPercent)} unrealized return
              ({formatCurrency(metrics.topPerformer.gainLoss)}).
            </p>
          </li>
        )}
        {metrics.worstPerformer && (
          <li className="rounded-2xl border border-negative/20 bg-negative/10 px-4 py-3">
            <div className="flex items-center gap-2 text-negative">
              <ArrowTrendingUpIcon className="h-5 w-5 rotate-180" />
              <span className="font-semibold">{metrics.worstPerformer.name}</span>
              <span className="text-xs uppercase tracking-[0.3em]">{metrics.worstPerformer.symbol}</span>
            </div>
            <p className="mt-2 text-sm text-negative/90">
              Underperforming with {formatPercent(metrics.worstPerformer.gainLossPercent)} unrealized return
              ({formatCurrency(metrics.worstPerformer.gainLoss)}).
            </p>
          </li>
        )}
        {!metrics.topPerformer && !metrics.worstPerformer && (
          <li className="rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-slate-400">
            Log your strategy to surface automated insights.
          </li>
        )}
      </ul>
    </section>
  );
}
