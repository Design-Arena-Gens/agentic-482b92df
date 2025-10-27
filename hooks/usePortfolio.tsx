"use client";

import { createContext, useContext, useMemo } from "react";
import { nanoid } from "nanoid";

import type { EnrichedHolding, PortfolioHolding, PriceQuote } from "@/types/portfolio";
import { usePersistentState } from "./usePersistentState";
import { findAssetById, findAssetBySymbol } from "@/data/assets";

export interface PortfolioState {
  holdings: PortfolioHolding[];
  lastSync?: string;
}

export interface PortfolioContextValue {
  holdings: PortfolioHolding[];
  upsertHolding: (payload: Omit<PortfolioHolding, "id" | "name" | "symbol" | "category"> & {
    assetId?: string;
    symbol?: string;
    id?: string;
  }) => void;
  deleteHolding: (id: string) => void;
  resetPortfolio: () => void;
  setLastSync: (timestamp: string) => void;
  lastSync?: string;
}

const PortfolioContext = createContext<PortfolioContextValue | undefined>(undefined);

const STORAGE_KEY = "nebula-ledger::portfolio";

const defaultState: PortfolioState = {
  holdings: [],
  lastSync: undefined
};

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = usePersistentState<PortfolioState>(STORAGE_KEY, defaultState);

  const value = useMemo<PortfolioContextValue>(() => {
    function upsertHolding(payload: Omit<PortfolioHolding, "id" | "name" | "symbol" | "category"> & {
      assetId?: string;
      symbol?: string;
      id?: string;
    }) {
      const asset = payload.assetId
        ? findAssetById(payload.assetId)
        : payload.symbol
          ? findAssetBySymbol(payload.symbol)
          : undefined;

      if (!asset) {
        throw new Error("Unknown asset. Please choose a supported cryptocurrency.");
      }

      setState((prev) => {
        const existingIndex = payload.id ? prev.holdings.findIndex((h) => h.id === payload.id) : -1;
        const nextHolding: PortfolioHolding = {
          id: payload.id ?? nanoid(12),
          assetId: asset.id,
          symbol: asset.symbol,
          name: asset.name,
          category: asset.category,
          quantity: Number(payload.quantity),
          purchasePrice: Number(payload.purchasePrice),
          purchaseDate: payload.purchaseDate,
          notes: payload.notes
        };

        if (existingIndex >= 0) {
          const updated = [...prev.holdings];
          updated[existingIndex] = nextHolding;
          return { ...prev, holdings: updated };
        }

        return {
          ...prev,
          holdings: [...prev.holdings, nextHolding]
        };
      });
    }

    function deleteHolding(id: string) {
      setState((prev) => ({
        ...prev,
        holdings: prev.holdings.filter((holding) => holding.id !== id)
      }));
    }

    function resetPortfolio() {
      setState(defaultState);
    }

    function setLastSync(timestamp: string) {
      setState((prev) => ({ ...prev, lastSync: timestamp }));
    }

    return {
      holdings: state.holdings,
      lastSync: state.lastSync,
      upsertHolding,
      deleteHolding,
      resetPortfolio,
      setLastSync
    };
  }, [setState, state.holdings, state.lastSync]);

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}

export function enrichHoldings(holdings: PortfolioHolding[], quotes: PriceQuote[]): EnrichedHolding[] {
  const quoteMap = new Map(quotes.map((quote) => [quote.assetId, quote]));

  return holdings.map((holding) => {
    const quote = quoteMap.get(holding.assetId);
    const price = quote?.price ?? holding.purchasePrice;
    const marketValue = price * holding.quantity;
    const costBasis = holding.purchasePrice * holding.quantity;
    const gainLoss = marketValue - costBasis;
    const gainLossPercent = costBasis === 0 ? 0 : gainLoss / costBasis;

    return {
      ...holding,
      marketValue,
      costBasis,
      gainLoss,
      gainLossPercent,
      price,
      change24h: quote?.change24h ?? 0
    } satisfies EnrichedHolding;
  });
}
