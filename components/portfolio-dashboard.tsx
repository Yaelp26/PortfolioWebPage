"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { ExperiencesSection } from "@/components/experiences-section";
import { FolderOpen, Zap, Briefcase, LogOut, Home } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function PortfolioDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleLogout() {
    try {
      await signOut({ redirect: false });
      toast.success("Sesión cerrada exitosamente");
      router.push("/");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
                Gestor de Portafolio Profesional
              </h1>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                Administra tus proyectos, habilidades tecnicas y experiencia laboral en un solo lugar.
              </p>
              {session?.user && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Bienvenido, <span className="font-semibold">{session.user.name}</span>
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/")}>
                <Home className="h-4 w-4 mr-2" />
                Inicio
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <Tabs defaultValue="projects" className="flex flex-col gap-6">
          <TabsList className="w-fit">
            <TabsTrigger value="projects" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              Proyectos
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-2">
              <Zap className="h-4 w-4" />
              Habilidades
            </TabsTrigger>
            <TabsTrigger value="experiences" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Experiencia
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectsSection />
          </TabsContent>

          <TabsContent value="skills">
            <SkillsSection />
          </TabsContent>

          <TabsContent value="experiences">
            <ExperiencesSection />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
