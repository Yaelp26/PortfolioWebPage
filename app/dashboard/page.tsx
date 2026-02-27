import { SWRProvider } from "@/components/swr-provider";
import { PortfolioDashboard } from "@/components/portfolio-dashboard";

export default function DashboardPage() {
  return (
    <SWRProvider>
      <PortfolioDashboard />
    </SWRProvider>
  );
}
