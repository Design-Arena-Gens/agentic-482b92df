"use client";

import { ArrowDownRightIcon, ArrowUpRightIcon, ClockIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

import type { PortfolioMetrics } from "@/hooks/usePortfolioMetrics";
import { formatCurrency, formatPercent } from "@/lib/format";

interface SummaryCardsProps {
  metrics: PortfolioMetrics;
  lastSync?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function SummaryCards({ metrics, lastSync, onRefresh, isRefreshing }: SummaryCardsProps) {
  const lastSyncLabel = lastSync
    ? new Date(lastSync).toLocaleString()
    : "Awaiting first synchronization";

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article className="glass-panel card-hover rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-[0.35em] text-slate-500">Portfolio Value</h2>
          <CurrencyDollarIcon className="h-5 w-5 text-accent" />
        </div>
        <p className="mt-4 text-3xl font-semibold text-slate-100">
          {formatCurrency(metrics.totalMarketValue)}
        </p>
        <p className="mt-2 text-sm text-slate-400">Cost basis {formatCurrency(metrics.totalCostBasis)}</p>
      </article>

      <article className="glass-panel card-hover rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-[0.35em] text-slate-500">Performance</h2>
          {metrics.absoluteGain >= 0 ? (
            <ArrowUpRightIcon className="h-5 w-5 text-positive" />
          ) : (
            <ArrowDownRightIcon className="h-5 w-5 text-negative" />
          )}
        </div>
        <p className={`mt-4 text-3xl font-semibold ${metrics.absoluteGain >= 0 ? "text-positive" : "text-negative"}`}>
          {formatCurrency(metrics.absoluteGain)}
        </p>
        <p className="mt-2 text-sm text-slate-400">{formatPercent(metrics.relativeGain)}</p>
      </article>

      <article className="glass-panel card-hover rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-[0.35em] text-slate-500">24h Change</h2>
          <ClockIcon className="h-5 w-5 text-accent" />
        </div>
        <p className={`mt-4 text-3xl font-semibold ${metrics.dailyChangeValue >= 0 ? "text-positive" : "text-negative"}`}>
          {formatCurrency(metrics.dailyChangeValue)}
        </p>
        <p className="mt-2 text-sm text-slate-400">{formatPercent(metrics.dailyChangePercent)}</p>
      </article>

      <article className="glass-panel card-hover rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-[0.35em] text-slate-500">Synchronization</h2>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh
          </button>
        </div>
        <p className="mt-4 text-lg font-medium text-slate-200">{lastSyncLabel}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.35em] text-slate-500">
          Updated once per minute · Powered by CoinGecko
        </p>
      </article>
    </section>
  );
}
