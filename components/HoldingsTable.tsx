"use client";

import { TrashIcon } from "@heroicons/react/24/outline";

import { usePortfolio } from "@/hooks/usePortfolio";
import type { EnrichedHolding } from "@/types/portfolio";
import { formatCurrency, formatDate, formatPercent } from "@/lib/format";

interface HoldingsTableProps {
  holdings: EnrichedHolding[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
  const { deleteHolding } = usePortfolio();

  if (!holdings.length) {
    return (
      <section className="glass-panel flex flex-col items-center justify-center gap-4 rounded-3xl p-10 text-center">
        <h3 className="text-2xl font-semibold text-slate-100">Construct your first allocation</h3>
        <p className="max-w-lg text-sm text-slate-400">
          Log a position above to begin tracking performance. Nebula Ledger will automatically retrieve real-time
          market quotes and surface actionable intelligence.
        </p>
      </section>
    );
  }

  return (
    <section className="glass-panel rounded-3xl">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Holdings overview</h2>
          <p className="text-sm text-slate-400">Cost basis, market value, and performance for each position.</p>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800/80 text-sm">
          <thead className="text-xs uppercase tracking-[0.3em] text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-4 text-left">
                Asset
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Price
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Quantity
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Market Value
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Cost Basis
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                P / L
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                24h
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Added
              </th>
              <th scope="col" className="px-6 py-4" aria-label="actions" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {holdings.map((holding) => (
              <tr key={holding.id} className="hover:bg-slate-900/40">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-100">{holding.name}</span>
                    <span className="text-xs uppercase tracking-[0.35em] text-slate-500">{holding.symbol}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-slate-200">{formatCurrency(holding.price)}</td>
                <td className="px-6 py-4 text-right text-slate-200">{holding.quantity.toLocaleString()}</td>
                <td className="px-6 py-4 text-right text-slate-100">{formatCurrency(holding.marketValue)}</td>
                <td className="px-6 py-4 text-right text-slate-200">{formatCurrency(holding.costBasis)}</td>
                <td
                  className={`px-6 py-4 text-right font-medium ${
                    holding.gainLoss >= 0 ? "text-positive" : "text-negative"
                  }`}
                >
                  {formatCurrency(holding.gainLoss)}
                  <span className="ml-2 text-xs">({formatPercent(holding.gainLossPercent)})</span>
                </td>
                <td
                  className={`px-6 py-4 text-right ${holding.change24h >= 0 ? "text-positive" : "text-negative"}`}
                >
                  {holding.change24h.toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-right text-slate-400">{formatDate(holding.purchaseDate)}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => deleteHolding(holding.id)}
                    className="inline-flex items-center rounded-xl border border-transparent bg-slate-800/80 p-2 text-slate-400 transition hover:border-negative/40 hover:text-negative"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
