"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Github, Linkedin, ExternalLink, ArrowLeft, Mail } from "lucide-react";
import type { PublicUser } from "@/core/entities/user";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PortfolioPage() {
  const params = useParams();
  const userId = params?.id as string;

  const { data: user, error, isLoading } = useSWR<PublicUser>(
    userId ? `/api/users/${userId}` : null,
    fetcher
  );

  if (isLoading) {
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

  if (error || !user) {
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

        {/* Placeholder for future sections */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Proyectos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sección de proyectos próximamente...
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Habilidades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sección de habilidades próximamente...
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Experiencia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Sección de experiencia próximamente...
              </p>
            </CardContent>
          </Card>
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
