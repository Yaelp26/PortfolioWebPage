import { SWRProvider } from "@/components/swr-provider";
import { UsersGallery } from "@/components/users-gallery";
import { HomeHeader } from "@/components/home-header";

export default function Home() {
  return (
    <SWRProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <HomeHeader />

          {/* Users Gallery */}
          <UsersGallery />
        </div>
      </div>
    </SWRProvider>
  );
}
