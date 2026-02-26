/**
 * Experiences API - Collection endpoints (GET all, POST create).
 * Communicates only with /core via the DI container.
 */
import { NextResponse } from "next/server";
import { experienceService } from "@/web/container";
import { ZodError } from "zod";

export async function GET() {
  try {
    const experiences = await experienceService.getAllExperiences();
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json({ error: "Error al obtener las experiencias" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const experience = await experienceService.createExperience(body);
    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos invalidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating experience:", error);
    return NextResponse.json({ error: "Error al crear la experiencia" }, { status: 500 });
  }
}
