"use client";

import { useEffect } from "react";

import { AddHoldingForm } from "@/components/AddHoldingForm";
import { AllocationChart } from "@/components/AllocationChart";
import { HeroHeader } from "@/components/HeroHeader";
import { HoldingsTable } from "@/components/HoldingsTable";
import { InsightsPanel } from "@/components/InsightsPanel";
import { PerformanceComparisonChart } from "@/components/PerformanceComparisonChart";
import { SummaryCards } from "@/components/SummaryCards";
import { usePortfolio, enrichHoldings } from "@/hooks/usePortfolio";
import { usePortfolioMetrics } from "@/hooks/usePortfolioMetrics";
import { usePriceQuotes } from "@/hooks/usePriceQuotes";

export function PortfolioDashboard() {
  const { holdings, lastSync, setLastSync } = usePortfolio();
  const assetIds = holdings.map((holding) => holding.assetId);
  const { quotes, fetchedAt, isLoading, refresh } = usePriceQuotes(assetIds);
  const enrichedHoldings = enrichHoldings(holdings, quotes);
  const metrics = usePortfolioMetrics(enrichedHoldings);

  useEffect(() => {
    if (fetchedAt) {
      setLastSync(fetchedAt);
    }
  }, [fetchedAt, setLastSync]);

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <HeroHeader />
      <SummaryCards metrics={metrics} lastSync={lastSync} onRefresh={() => refresh()} isRefreshing={isLoading} />
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <AddHoldingForm />
        <InsightsPanel metrics={metrics} />
      </section>
      <HoldingsTable holdings={enrichedHoldings} />
      <section className="grid gap-6 lg:grid-cols-2">
        <PerformanceComparisonChart holdings={enrichedHoldings} />
        <AllocationChart metrics={metrics} />
      </section>
    </main>
  );
}
