"use client";

import { SparklesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function HeroHeader() {
  return (
    <header className="gridlines relative overflow-hidden rounded-3xl border border-slate-800/50 bg-slate-900/40 p-8 shadow-card md:p-10">
      <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-accent/20 blur-3xl" aria-hidden />
      <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-accentMuted/10 blur-3xl" aria-hidden />
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            <SparklesIcon className="h-4 w-4" />
            Nebula Ledger
          </span>
          <h1 className="mt-4 text-4xl font-semibold text-slate-50 md:text-5xl">
            Professional cryptocurrency intelligence to power your next move.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Curate positions, surface real-time performance, and transform your portfolio strategy with
            institutional-grade analytics.
          </p>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 text-sm text-slate-300">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-[0.25em] text-slate-500">Strategic Edge</span>
            <strong className="text-2xl text-slate-50">Scenario Modeling</strong>
            <p className="mt-2 text-sm">
              Stress-test your thesis, monitor drawdowns, and log narrative notes directly alongside your
              capital allocation.
            </p>
          </div>
          <hr className="border-slate-800" />
          <Link
            href="https://www.coingecko.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 font-semibold text-white shadow-lg shadow-accent/30 transition hover:bg-accentMuted"
          >
            Market Pulse →
          </Link>
        </div>
      </div>
    </header>
  );
}
