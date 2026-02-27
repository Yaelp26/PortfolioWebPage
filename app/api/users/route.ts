import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/web/container";

/**
 * GET /api/users - Get all users (public data only)
 */
export async function GET() {
  try {
    const users = await userService.getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/users - Create a new user (registration)
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const user = await userService.createUser(data);
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    
    if (error.message === "El email ya está registrado") {
      return NextResponse.json(
        { error: error.message },
        { status: 409 },
      );
    }
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 },
      );
    }
    
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 },
    );
  }
}
