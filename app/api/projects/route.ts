/**
 * Projects API - Collection endpoints (GET all, POST create).
 * 
 * This route belongs to the /web layer and communicates ONLY with /core
 * through the dependency injection container. It never accesses /data directly.
 */
import { NextResponse } from "next/server";
import { projectService } from "@/web/container";
import { ZodError } from "zod";

/**
 * GET /api/projects - Retrieve all projects.
 */
export async function GET() {
  try {
    const projects = await projectService.getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Error al obtener los proyectos" }, { status: 500 });
  }
}

/**
 * POST /api/projects - Create a new project.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = await projectService.createProject(body);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos invalidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Error al crear el proyecto" }, { status: 500 });
  }
}
