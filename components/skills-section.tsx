"use client";

import useSWR from "swr";
import { useState } from "react";
import type { Skill } from "@/core/entities/skill";
import { SKILL_CATEGORIES } from "@/core/validators/skill-validator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Zap } from "lucide-react";
import { toast } from "sonner";

const emptyForm = {
  name: "",
  category: "",
  proficiency: "50",
  iconUrl: "",
};

export function SkillsSection() {
  const { data: skills, mutate, isLoading } = useSWR<Skill[]>("/api/skills");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEdit(s: Skill) {
    setEditingId(s.id);
    setForm({
      name: s.name,
      category: s.category,
      proficiency: String(s.proficiency),
      iconUrl: s.iconUrl ?? "",
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      category: form.category,
      proficiency: Number(form.proficiency),
      iconUrl: form.iconUrl || null,
    };

    try {
      if (editingId) {
        const res = await fetch(`/api/skills/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Error al actualizar");
        }
        toast.success("Habilidad actualizada exitosamente");
      } else {
        const res = await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Error al crear");
        }
        toast.success("Habilidad creada exitosamente");
      }
      mutate();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      toast.success("Habilidad eliminada");
      mutate();
    } catch {
      toast.error("Error al eliminar la habilidad");
    }
  }

  // Group skills by category
  const grouped = (skills ?? []).reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Cargando habilidades...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Habilidades</h2>
          <p className="text-sm text-muted-foreground">Gestiona tus habilidades tecnicas</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Habilidad
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Habilidad" : "Nueva Habilidad"}</DialogTitle>
              <DialogDescription>
                {editingId ? "Modifica los datos de la habilidad." : "Agrega una nueva habilidad tecnica."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="skill-name">Nombre *</Label>
                <Input id="skill-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="React.js" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="skill-category">Categoria *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })} required>
                  <SelectTrigger id="skill-category">
                    <SelectValue placeholder="Selecciona una categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {SKILL_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="skill-proficiency">Nivel de Dominio: {form.proficiency}%</Label>
                <Input
                  id="skill-proficiency"
                  type="range"
                  min="1"
                  max="100"
                  value={form.proficiency}
                  onChange={(e) => setForm({ ...form, proficiency: e.target.value })}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="skill-icon">URL del Icono (opcional)</Label>
                <Input id="skill-icon" value={form.iconUrl} onChange={(e) => setForm({ ...form, iconUrl: e.target.value })} placeholder="https://ejemplo.com/icono.svg" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit">{editingId ? "Guardar Cambios" : "Crear Habilidad"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-sm">No hay habilidades todavia. Agrega la primera.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <div key={category} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-medium">{category}</Badge>
                <span className="text-xs text-muted-foreground">{catSkills.length} {catSkills.length === 1 ? "habilidad" : "habilidades"}</span>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {catSkills.map((skill) => (
                  <Card key={skill.id}>
                    <CardContent className="flex items-center gap-4 py-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm truncate text-foreground">{skill.name}</span>
                          <span className="text-xs text-muted-foreground ml-2 shrink-0">{skill.proficiency}%</span>
                        </div>
                        <Progress value={skill.proficiency} className="h-2" />
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(skill)}>
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">Editar habilidad</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Eliminar habilidad</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Eliminar Habilidad</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta accion no se puede deshacer. Se eliminara permanentemente &quot;{skill.name}&quot;.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(skill.id)} className="bg-destructive text-white hover:bg-destructive/90">Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
