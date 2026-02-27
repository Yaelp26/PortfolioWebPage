import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/web/container";
import { auth } from "@/lib/auth";

/**
 * GET /api/users/[id] - Get a user by ID (public data)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const user = await userService.getPublicUserById(id);

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Error al obtener usuario" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/users/[id] - Update a user (requires authentication)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id: paramId } = await params;
    const id = parseInt(paramId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Check if user is updating their own profile
    if (session.user.id !== id.toString()) {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }

    const data = await request.json();
    const user = await userService.updateUser(id, data);

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error updating user:", error);
    
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
      { error: "Error al actualizar usuario" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/users/[id] - Delete a user (requires authentication)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id: paramId } = await params;
    const id = parseInt(paramId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Check if user is deleting their own account
    if (session.user.id !== id.toString()) {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }

    const success = await userService.deleteUser(id);

    if (!success) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Error al eliminar usuario" },
      { status: 500 },
    );
  }
}
