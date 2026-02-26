/**
 * Experiences API - Individual endpoints (GET by ID, PUT update, DELETE).
 * Communicates only with /core via the DI container.
 */
import { NextResponse } from "next/server";
import { experienceService } from "@/web/container";
import { ZodError } from "zod";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const experience = await experienceService.getExperienceById(Number(id));
    if (!experience) {
      return NextResponse.json({ error: "Experiencia no encontrada" }, { status: 404 });
    }
    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error fetching experience:", error);
    return NextResponse.json({ error: "Error al obtener la experiencia" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const experience = await experienceService.updateExperience(Number(id), body);
    if (!experience) {
      return NextResponse.json({ error: "Experiencia no encontrada" }, { status: 404 });
    }
    return NextResponse.json(experience);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos invalidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating experience:", error);
    return NextResponse.json({ error: "Error al actualizar la experiencia" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await experienceService.deleteExperience(Number(id));
    if (!deleted) {
      return NextResponse.json({ error: "Experiencia no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ message: "Experiencia eliminada exitosamente" });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json({ error: "Error al eliminar la experiencia" }, { status: 500 });
  }
}
