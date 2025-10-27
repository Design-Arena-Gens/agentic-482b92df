"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

import { CORE_ASSETS, searchAssets } from "@/data/assets";
import { usePortfolio } from "@/hooks/usePortfolio";
import type { AssetDescriptor } from "@/types/portfolio";

interface FormState {
  assetId: string;
  query: string;
  quantity: string;
  purchasePrice: string;
  purchaseDate: string;
  notes: string;
  error?: string;
}

const initialState: FormState = {
  assetId: CORE_ASSETS[0]?.id ?? "",
  query: "",
  quantity: "",
  purchasePrice: "",
  purchaseDate: "",
  notes: ""
};

function normalizeNumber(value: string) {
  return value.replace(/,/g, "");
}

export function AddHoldingForm() {
  const { upsertHolding } = usePortfolio();
  const [form, setForm] = useState<FormState>(initialState);

  const suggestions = useMemo<AssetDescriptor[]>(() => {
    return form.query ? searchAssets(form.query) : CORE_ASSETS.slice(0, 8);
  }, [form.query]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleAssetSelect(asset: AssetDescriptor) {
    setForm((prev) => ({
      ...prev,
      assetId: asset.id,
      query: `${asset.name} (${asset.symbol})`
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const quantity = Number(normalizeNumber(form.quantity));
    const purchasePrice = Number(normalizeNumber(form.purchasePrice));

    if (!quantity || quantity <= 0) {
      return setForm((prev) => ({ ...prev, error: "Enter a position size greater than zero." }));
    }

    if (!purchasePrice || purchasePrice <= 0) {
      return setForm((prev) => ({ ...prev, error: "Enter the acquisition price per coin." }));
    }

    try {
      upsertHolding({
        assetId: form.assetId,
        quantity,
        purchasePrice,
        purchaseDate: form.purchaseDate || undefined,
        notes: form.notes || undefined
      });
      setForm({ ...initialState, assetId: form.assetId, error: undefined });
    } catch (error) {
      if (error instanceof Error) {
        setForm((prev) => ({ ...prev, error: error.message }));
      }
    }
  }

  return (
    <section className="glass-panel rounded-3xl p-6">
      <header className="flex flex-col gap-2 border-b border-slate-800 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Log a position</h2>
          <p className="text-sm text-slate-400">Document entries, exits, and strategic notes in seconds.</p>
        </div>
      </header>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-300">Asset</label>
          <div className="relative mt-2">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              name="query"
              value={form.query}
              onChange={handleChange}
              placeholder="Search tokens by name or ticker"
              className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 py-3 pl-12 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-20 mt-2 max-h-52 w-full overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/95 p-2 shadow-card">
                {suggestions.map((asset) => (
                  <li key={asset.id}>
                    <button
                      type="button"
                      onClick={() => handleAssetSelect(asset)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-slate-800/80 ${asset.id === form.assetId ? "bg-slate-800/60" : ""}`}
                    >
                      <span>
                        <span className="font-medium text-slate-200">{asset.name}</span>
                        <span className="ml-2 text-xs uppercase tracking-[0.3em] text-slate-500">{asset.symbol}</span>
                      </span>
                      <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-[0.4em] text-slate-400">
                        {asset.category}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300">Position size</label>
          <input
            type="number"
            min="0"
            step="any"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="e.g. 2.5"
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300">Purchase price (USD)</label>
          <input
            type="number"
            min="0"
            step="any"
            name="purchasePrice"
            value={form.purchasePrice}
            onChange={handleChange}
            placeholder="e.g. 1800"
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-300">Execution date</label>
          <input
            type="date"
            name="purchaseDate"
            value={form.purchaseDate}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-300">Investment thesis</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Capture catalysts, risk factors, or exit plan."
            className="mt-2 h-24 w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
        {form.error && (
          <p className="md:col-span-2 rounded-2xl border border-negative/30 bg-negative/10 px-4 py-3 text-sm text-negative">
            {form.error}
          </p>
        )}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-2xl bg-accent px-6 py-3 font-semibold text-white shadow-lg shadow-accent/30 transition hover:bg-accentMuted"
          >
            <PlusIcon className="h-5 w-5" />
            Add to ledger
          </button>
        </div>
      </form>
    </section>
  );
}
