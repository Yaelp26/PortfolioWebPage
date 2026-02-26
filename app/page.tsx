import { PortfolioDashboard } from "@/components/portfolio-dashboard";
import { SWRProvider } from "@/components/swr-provider";

export default function Home() {
  return (
    <SWRProvider>
      <PortfolioDashboard />
    </SWRProvider>
  );
}
