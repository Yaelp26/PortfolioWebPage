"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Github, Linkedin, ExternalLink, ArrowLeft, Mail, MapPin, Calendar, Briefcase as BriefcaseIcon } from "lucide-react";
import type { PublicUser } from "@/core/entities/user";
import type { Project } from "@/core/entities/project";
import type { Skill } from "@/core/entities/skill";
import type { Experience } from "@/core/entities/experience";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PortfolioPage() {
  const params = useParams();
  const userId = params?.id as string;

  const { data: user, error: userError, isLoading: userLoading } = useSWR<PublicUser>(
    userId ? `/api/users/${userId}` : null,
    fetcher
  );

  const { data: projects, isLoading: projectsLoading } = useSWR<Project[]>(
    userId ? `/api/projects?userId=${userId}` : null,
    fetcher
  );

  const { data: skills, isLoading: skillsLoading } = useSWR<Skill[]>(
    userId ? `/api/skills?userId=${userId}` : null,
    fetcher
  );

  const { data: experiences, isLoading: experiencesLoading } = useSWR<Experience[]>(
    userId ? `/api/experiences?userId=${userId}` : null,
    fetcher
  );

  // Group skills by category (validate array)
  const groupedSkills = (Array.isArray(skills) ? skills : []).reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // Validate arrays
  const validProjects = Array.isArray(projects) ? projects : [];
  const validExperiences = Array.isArray(experiences) ? experiences : [];

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-10 w-32 mb-8" />
          <Card>
            <CardHeader>
              <div className="flex items-center gap-6">
                <Skeleton className="h-32 w-32 rounded-full" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12">
          <Button asChild variant="ghost" className="mb-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">
                Usuario no encontrado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                El portfolio que buscas no existe o ha sido eliminado.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>

        {/* User Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                <AvatarFallback className="text-3xl">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.githubUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={user.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {user.linkedinUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={user.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  {user.portfolioUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={user.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Sitio Web
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          {user.bio && (
            <CardContent>
              <h2 className="text-lg font-semibold mb-2">Acerca de mí</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {user.bio}
              </p>
            </CardContent>
          )}
        </Card>

      {/* Projects Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Proyectos</h2>
        {projectsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : validProjects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-sm">No hay proyectos disponibles</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {validProjects.map((project) => (
              <Card key={project.id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                  {project.startDate && (
                    <CardDescription>
                      {project.startDate.split("T")[0]}
                      {project.endDate ? ` - ${project.endDate.split("T")[0]}` : " - Presente"}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-3 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 mt-auto pt-2">
                    {project.liveUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" /> Sitio
                        </a>
                      </Button>
                    )}
                    {project.repoUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-3 w-3 mr-1" /> Repo
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Habilidades</h2>
        {skillsLoading ? (
          <Card className="animate-pulse">
            <CardContent className="py-8">
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ) : Object.keys(groupedSkills).length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-sm">No hay habilidades disponibles</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.proficiency}%</span>
                      </div>
                      <Progress value={skill.proficiency} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Experiences Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Experiencia</h2>
        {experiencesLoading ? (
          <Card className="animate-pulse">
            <CardContent className="py-8">
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ) : validExperiences.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-sm">No hay experiencia disponible</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {validExperiences.map((exp) => (
              <Card key={exp.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{exp.position}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        <span className="font-semibold">{exp.company}</span>
                        {exp.location && (
                          <span className="flex items-center gap-1 mt-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {exp.startDate.split("T")[0]}
                        {exp.isCurrent ? " - Presente" : exp.endDate ? ` - ${exp.endDate.split("T")[0]}` : ""}
                      </span>
                      {exp.isCurrent && <Badge variant="secondary">Actual</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{exp.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Miembro desde {new Date(user.createdAt).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</p>
      </div>
      </div>
    </div>
  );
}
