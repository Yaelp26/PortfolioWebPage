"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserPlus, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";

export function HomeHeader() {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleLogout() {
    try {
      await signOut({ redirect: false });
      toast.success("Sesión cerrada exitosamente");
      router.refresh();
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  }

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Portfolios Profesionales
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        Descubre los portfolios de desarrolladores talentosos
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        {session ? (
          <>
            <Button asChild size="lg">
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Mi Dashboard
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={handleLogout}>
              <LogOut className="mr-2 h-5 w-5" />
              Cerrar Sesión
            </Button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
