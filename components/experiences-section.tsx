"use client";

import useSWR from "swr";
import { useState } from "react";
import type { Experience } from "@/core/entities/experience";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Briefcase, MapPin } from "lucide-react";
import { toast } from "sonner";

const emptyForm = {
  company: "",
  position: "",
  description: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  location: "",
};

export function ExperiencesSection() {
  const { data: experiences, mutate, isLoading } = useSWR<Experience[]>("/api/experiences");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(exp: Experience) {
    setEditingId(exp.id);
    setForm({
      company: exp.company,
      position: exp.position,
      description: exp.description,
      startDate: exp.startDate ? exp.startDate.split("T")[0] : "",
      endDate: exp.endDate ? exp.endDate.split("T")[0] : "",
      isCurrent: exp.isCurrent,
      location: exp.location ?? "",
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      company: form.company,
      position: form.position,
      description: form.description,
      startDate: form.startDate,
      endDate: form.isCurrent ? null : (form.endDate || null),
      isCurrent: form.isCurrent,
      location: form.location || null,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/experiences/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Error al actualizar");
        }
        toast.success("Experiencia actualizada exitosamente");
      } else {
        const res = await fetch("/api/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Error al crear");
        }
        toast.success("Experiencia creada exitosamente");
      }
      mutate();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      toast.success("Experiencia eliminada");
      mutate();
    } catch {
      toast.error("Error al eliminar la experiencia");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Cargando experiencias...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Experiencia Laboral</h2>
          <p className="text-sm text-muted-foreground">Gestiona tu historial profesional</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Experiencia
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Experiencia" : "Nueva Experiencia"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Modifica los datos de la experiencia." : "Agrega una nueva experiencia laboral."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="company">Empresa *</Label>
                  <Input id="company" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Google" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="position">Puesto *</Label>
                  <Input id="position" required value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Desarrollador Senior" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="exp-description">Descripcion *</Label>
                <Textarea id="exp-description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Responsabilidades y logros..." rows={3} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="exp-location">Ubicacion</Label>
                <Input id="exp-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ciudad de Mexico, Mexico" />
              </div>
              <div className="flex items-center gap-3">
                <Switch id="is-current" checked={form.isCurrent} onCheckedChange={(checked) => setForm({ ...form, isCurrent: checked })} />
                <Label htmlFor="is-current">Puesto actual</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="exp-start">Fecha Inicio *</Label>
                  <Input id="exp-start" type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                {!form.isCurrent && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="exp-end">Fecha Fin</Label>
                    <Input id="exp-end" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit">{editingId ? "Guardar Cambios" : "Crear Experiencia"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!experiences || experiences.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-sm">No hay experiencias todavia. Agrega la primera.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {experiences.map((exp) => (
            <Card key={exp.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-lg">{exp.position}</CardTitle>
                      {exp.isCurrent && <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">Actual</Badge>}
                    </div>
                    <CardDescription className="mt-1 flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground/80">{exp.company}</span>
                      {exp.location && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {exp.location}
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        {exp.startDate.split("T")[0]} - {exp.isCurrent ? "Presente" : exp.endDate ? exp.endDate.split("T")[0] : "N/A"}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(exp)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar experiencia</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar experiencia</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar Experiencia</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta accion no se puede deshacer. Se eliminara permanentemente la experiencia en &quot;{exp.company}&quot;.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(exp.id)} className="bg-destructive text-white hover:bg-destructive/90">Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{exp.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
