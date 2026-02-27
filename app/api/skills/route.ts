/**
 * Skills API - Collection endpoints (GET all, POST create).
 * Communicates only with /core via the DI container.
 */
import { NextResponse } from "next/server";
import { skillService } from "@/web/container";
import { ZodError } from "zod";

/**
 * GET /api/skills - Retrieve all skills or skills by user.
 * Query params:
 *   - userId (optional): Filter skills by user ID
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      const skills = await skillService.getSkillsByUserId(parseInt(userId));
      return NextResponse.json(skills);
    }

    const skills = await skillService.getAllSkills();
    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json({ error: "Error al obtener las habilidades" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const skill = await skillService.createSkill(body);
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Datos invalidos", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating skill:", error);
    return NextResponse.json({ error: "Error al crear la habilidad" }, { status: 500 });
  }
}
