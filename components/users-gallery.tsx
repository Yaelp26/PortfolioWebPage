"use client";

import useSWR from "swr";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, ExternalLink, User } from "lucide-react";
import type { PublicUser } from "@/core/entities/user";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function UsersGallery() {
  const { data: users, error, isLoading } = useSWR<PublicUser[]>("/api/users", fetcher);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-3 w-1/2 bg-muted rounded" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error al cargar usuarios</CardTitle>
          <CardDescription>No se pudieron cargar los portfolios.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No hay portfolios aún</CardTitle>
          <CardDescription>
            ¡Sé el primero en crear tu portfolio profesional!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <Card key={user.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatarUrl || undefined} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{user.name}</CardTitle>
                <CardDescription className="truncate">{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.bio && (
              <p className="text-sm text-muted-foreground line-clamp-3">{user.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-2">
              {user.githubUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1 min-w-[100px]"
                >
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
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1 min-w-[100px]"
                >
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
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1 min-w-[100px]"
                >
                  <a
                    href={user.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Portfolio
                  </a>
                </Button>
              )}
            </div>

            <Button asChild className="w-full">
              <Link href={`/portfolio/${user.id}`}>
                <User className="h-4 w-4 mr-2" />
                Ver Portfolio Completo
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
