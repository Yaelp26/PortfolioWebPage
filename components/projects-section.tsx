"use client";

import useSWR from "swr";
import { useState } from "react";
import { useSession } from "next-auth/react";
import type { Project } from "@/core/entities/project";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, ExternalLink, Github, FolderOpen } from "lucide-react";
import { toast } from "sonner";

const emptyForm = {
  title: "",
  description: "",
  imageUrl: "",
  technologies: "",
  liveUrl: "",
  repoUrl: "",
  startDate: "",
  endDate: "",
};

export function ProjectsSection() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: projects, mutate, isLoading } = useSWR<Project[]>(
    userId ? `/api/projects?userId=${userId}` : null
  );
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(p: Project) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl ?? "",
      technologies: p.technologies.join(", "),
      liveUrl: p.liveUrl ?? "",
      repoUrl: p.repoUrl ?? "",
      startDate: p.startDate ? p.startDate.split("T")[0] : "",
      endDate: p.endDate ? p.endDate.split("T")[0] : "",
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!userId) {
      toast.error("Debes iniciar sesión para crear proyectos");
      return;
    }

    const payload = {
      userId: parseInt(userId),
      title: form.title,
      description: form.description,
      imageUrl: form.imageUrl || null,
      technologies: form.technologies ? form.technologies.split(",").map((t) => t.trim()).filter(Boolean) : [],
      liveUrl: form.liveUrl || null,
      repoUrl: form.repoUrl || null,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/projects/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Error al actualizar");
        }
        toast.success("Proyecto actualizado exitosamente");
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Error al crear");
        }
        toast.success("Proyecto creado exitosamente");
      }
      mutate();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      toast.success("Proyecto eliminado");
      mutate();
    } catch {
      toast.error("Error al eliminar el proyecto");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Cargando proyectos...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Proyectos</h2>
          <p className="text-sm text-muted-foreground">Gestiona tus proyectos de portafolio</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Proyecto" : "Nuevo Proyecto"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Modifica los datos del proyecto." : "Completa los datos para crear un nuevo proyecto."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Titulo *</Label>
                <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Mi Proyecto" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Descripcion *</Label>
                <Textarea id="description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripcion del proyecto..." rows={3} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="technologies">Tecnologias (separadas por coma)</Label>
                <Input id="technologies" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, PostgreSQL" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="startDate">Fecha Inicio</Label>
                  <Input id="startDate" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="endDate">Fecha Fin</Label>
                  <Input id="endDate" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="imageUrl">URL de Imagen</Label>
                <Input id="imageUrl" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://ejemplo.com/imagen.png" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="liveUrl">URL del Sitio</Label>
                  <Input id="liveUrl" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://..." />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="repoUrl">URL del Repositorio</Label>
                  <Input id="repoUrl" value={form.repoUrl} onChange={(e) => setForm({ ...form, repoUrl: e.target.value })} placeholder="https://github.com/..." />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit">{editingId ? "Guardar Cambios" : "Crear Proyecto"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!projects || !Array.isArray(projects) || projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-sm">No hay proyectos todavia. Crea el primero.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg leading-tight truncate">{project.title}</CardTitle>
                    {project.startDate && (
                      <CardDescription className="mt-1">
                        {project.startDate.split("T")[0]}
                        {project.endDate ? ` - ${project.endDate.split("T")[0]}` : " - Presente"}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(project)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar proyecto</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar proyecto</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar Proyecto</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta accion no se puede deshacer. Se eliminara permanentemente el proyecto &quot;{project.title}&quot;.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(project.id)} className="bg-destructive text-white hover:bg-destructive/90">Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
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
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      <ExternalLink className="h-3 w-3" /> Sitio
                    </a>
                  )}
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      <Github className="h-3 w-3" /> Repositorio
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
