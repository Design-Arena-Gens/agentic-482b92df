export type AssetCategory = "layer1" | "defi" | "exchange" | "stablecoin" | "infrastructure" | "meme";

export interface AssetDescriptor {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
}

export interface PortfolioHolding {
  id: string;
  assetId: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  quantity: number;
  purchasePrice: number;
  purchaseDate?: string;
  notes?: string;
}

export interface PriceQuote {
  assetId: string;
  price: number;
  change24h: number;
  lastUpdated: string;
}

export interface EnrichedHolding extends PortfolioHolding {
  marketValue: number;
  costBasis: number;
  gainLoss: number;
  gainLossPercent: number;
  price: number;
  change24h: number;
}
