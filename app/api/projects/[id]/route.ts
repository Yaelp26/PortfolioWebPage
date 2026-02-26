/**
 * Projects API - Individual endpoints (GET by ID, PUT update, DELETE).
 * Communicates only with /core via the DI container.
 */
import { NextResponse } from "next/server";
import { projectService } from "@/web/container";
import { ZodError } from "zod";

/**
 * GET /api/projects/[id] - Retrieve a single project by ID.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const project = await projectService.getProjectById(Number(id));
    if (!project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Error al obtener el proyecto" }, { status: 500 });
  }
}

/**
 * PUT /api/projects/[id] - Update an existing project.
 */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const project = await projectService.updateProject(Number(id), body);
    if (!project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos invalidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Error al actualizar el proyecto" }, { status: 500 });
  }
}

/**
 * DELETE /api/projects/[id] - Delete a project.
 */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await projectService.deleteProject(Number(id));
    if (!deleted) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }
    return NextResponse.json({ message: "Proyecto eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Error al eliminar el proyecto" }, { status: 500 });
  }
}
