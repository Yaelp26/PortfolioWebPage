/**
 * Skills API - Individual endpoints (GET by ID, PUT update, DELETE).
 * Communicates only with /core via the DI container.
 */
import { NextResponse } from "next/server";
import { skillService } from "@/web/container";
import { ZodError } from "zod";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const skill = await skillService.getSkillById(Number(id));
    if (!skill) {
      return NextResponse.json({ error: "Habilidad no encontrada" }, { status: 404 });
    }
    return NextResponse.json(skill);
  } catch (error) {
    console.error("Error fetching skill:", error);
    return NextResponse.json({ error: "Error al obtener la habilidad" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const skill = await skillService.updateSkill(Number(id), body);
    if (!skill) {
      return NextResponse.json({ error: "Habilidad no encontrada" }, { status: 404 });
    }
    return NextResponse.json(skill);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos invalidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating skill:", error);
    return NextResponse.json({ error: "Error al actualizar la habilidad" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await skillService.deleteSkill(Number(id));
    if (!deleted) {
      return NextResponse.json({ error: "Habilidad no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ message: "Habilidad eliminada exitosamente" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return NextResponse.json({ error: "Error al eliminar la habilidad" }, { status: 500 });
  }
}
