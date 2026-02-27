import { SWRProvider } from "@/components/swr-provider";
import { UsersGallery } from "@/components/users-gallery";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus, LogIn } from "lucide-react";

export default function Home() {
  return (
    <SWRProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Portfolios Profesionales
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Descubre los portfolios de desarrolladores talentosos
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/register">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Crear mi Portfolio
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">
                  <LogIn className="mr-2 h-5 w-5" />
                  Iniciar Sesión
                </Link>
              </Button>
            </div>
          </div>

          {/* Users Gallery */}
          <UsersGallery />
        </div>
      </div>
    </SWRProvider>
  );
}
