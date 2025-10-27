"use client";

import { useMemo } from "react";

import type { EnrichedHolding } from "@/types/portfolio";

export interface PortfolioMetrics {
  totalMarketValue: number;
  totalCostBasis: number;
  absoluteGain: number;
  relativeGain: number;
  dailyChangeValue: number;
  dailyChangePercent: number;
  allocations: { label: string; value: number; percentage: number }[];
  topPerformer?: EnrichedHolding;
  worstPerformer?: EnrichedHolding;
}

export function usePortfolioMetrics(holdings: EnrichedHolding[]): PortfolioMetrics {
  return useMemo(() => {
    if (!holdings.length) {
      return {
        totalMarketValue: 0,
        totalCostBasis: 0,
        absoluteGain: 0,
        relativeGain: 0,
        dailyChangeValue: 0,
        dailyChangePercent: 0,
        allocations: []
      } satisfies PortfolioMetrics;
    }

    const totalMarketValue = holdings.reduce((sum, holding) => sum + holding.marketValue, 0);
    const totalCostBasis = holdings.reduce((sum, holding) => sum + holding.costBasis, 0);
    const absoluteGain = totalMarketValue - totalCostBasis;
    const relativeGain = totalCostBasis === 0 ? 0 : absoluteGain / totalCostBasis;

    const dailyChangeValue = holdings.reduce(
      (sum, holding) => sum + holding.marketValue * (holding.change24h / 100),
      0
    );
    const dailyChangePercent = totalMarketValue === 0 ? 0 : dailyChangeValue / totalMarketValue;

    const allocationsMap = new Map<string, number>();
    holdings.forEach((holding) => {
      const current = allocationsMap.get(holding.category) ?? 0;
      allocationsMap.set(holding.category, current + holding.marketValue);
    });

    const allocations = Array.from(allocationsMap.entries()).map(([label, value]) => ({
      label,
      value,
      percentage: totalMarketValue === 0 ? 0 : value / totalMarketValue
    }));

    const topPerformer = [...holdings].sort((a, b) => b.gainLossPercent - a.gainLossPercent)[0];
    const worstPerformer = [...holdings].sort((a, b) => a.gainLossPercent - b.gainLossPercent)[0];

    return {
      totalMarketValue,
      totalCostBasis,
      absoluteGain,
      relativeGain,
      dailyChangeValue,
      dailyChangePercent,
      allocations,
      topPerformer,
      worstPerformer
    } satisfies PortfolioMetrics;
  }, [holdings]);
}
