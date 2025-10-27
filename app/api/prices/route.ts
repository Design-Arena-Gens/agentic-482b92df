import { NextResponse } from "next/server";

import { CORE_ASSETS } from "@/data/assets";

const COINGECKO_ENDPOINT = "https://api.coingecko.com/api/v3/simple/price";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json({ quotes: [], fetchedAt: new Date().toISOString() }, { status: 200 });
  }

  const requestedIds = ids
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const validated = requestedIds.filter((id) => CORE_ASSETS.some((asset) => asset.id === id));

  if (!validated.length) {
    return NextResponse.json({ error: "No valid asset identifiers provided." }, { status: 400 });
  }

  const endpoint = `${COINGECKO_ENDPOINT}?ids=${validated.join(",")}&vs_currencies=usd&include_24hr_change=true`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Nebula-Ledger/1.0"
      },
      next: {
        revalidate: 60
      }
    });

    if (!response.ok) {
      throw new Error(`CoinGecko responded with status ${response.status}`);
    }

    const payload = await response.json();
    const fetchedAt = new Date().toISOString();

    const quotes = validated
      .map((assetId: string) => {
        const data = payload[assetId];
        if (!data) return undefined;
        return {
          assetId,
          price: Number(data.usd ?? 0),
          change24h: Number(data.usd_24h_change ?? 0),
          lastUpdated: fetchedAt
        };
      })
      .filter(Boolean);

    return NextResponse.json({ quotes, fetchedAt }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch CoinGecko quotes", error);
    return NextResponse.json(
      { error: "Unable to retrieve price data at this time. CoinGecko may be rate limiting requests." },
      { status: 503 }
    );
  }
}
