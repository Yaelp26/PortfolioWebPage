"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { ExperiencesSection } from "@/components/experiences-section";
import { FolderOpen, Zap, Briefcase } from "lucide-react";

export function PortfolioDashboard() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            Gestor de Portafolio Profesional
          </h1>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Administra tus proyectos, habilidades tecnicas y experiencia laboral en un solo lugar.
          </p>
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
