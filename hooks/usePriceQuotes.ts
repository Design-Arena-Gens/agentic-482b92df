"use client";

import useSWR from "swr";

import type { PriceQuote } from "@/types/portfolio";

async function fetcher(url: string): Promise<{ quotes: PriceQuote[]; fetchedAt: string }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Unable to fetch market data at this time. Please try again later.");
  }
  return response.json();
}

export function usePriceQuotes(assetIds: string[] | undefined) {
  const ids = assetIds?.filter(Boolean);
  const shouldFetch = Boolean(ids && ids.length);

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/prices?ids=${encodeURIComponent(ids.join(","))}` : null,
    fetcher,
    {
      refreshInterval: 60_000,
      shouldRetryOnError: true,
      revalidateOnFocus: false
    }
  );

  return {
    quotes: data?.quotes ?? [],
    fetchedAt: data?.fetchedAt,
    isLoading,
    isError: Boolean(error),
    error,
    refresh: mutate
  };
}
