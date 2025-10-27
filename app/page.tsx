import { PortfolioDashboard } from "@/components/PortfolioDashboard";
import { PortfolioProvider } from "@/hooks/usePortfolio";

export default function Page() {
  return (
    <PortfolioProvider>
      <PortfolioDashboard />
    </PortfolioProvider>
  );
}
