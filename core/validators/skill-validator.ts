/**
 * Skill Validator - Business rule validation for skills.
 * Pure domain validation with NO external dependencies beyond Zod.
 */
import { z } from "zod";

// Valid skill categories
export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Base de Datos",
  "DevOps",
  "Mobile",
  "Herramientas",
  "Lenguajes",
  "Otro",
] as const;

export const createSkillSchema = z.object({
  userId: z.number().int().positive("El ID de usuario debe ser un numero positivo"),
  name: z.string().min(1, "El nombre es obligatorio").max(255, "El nombre no puede exceder 255 caracteres"),
  category: z.string().min(1, "La categoria es obligatoria").max(100, "La categoria no puede exceder 100 caracteres"),
  proficiency: z
    .number()
    .int("El nivel debe ser un numero entero")
    .min(1, "El nivel minimo es 1")
    .max(100, "El nivel maximo es 100"),
  iconUrl: z.string().url("La URL del icono no es valida").nullable().optional(),
});

export const updateSkillSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(255).optional(),
  category: z.string().min(1, "La categoria es obligatoria").max(100).optional(),
  proficiency: z.number().int().min(1).max(100).optional(),
  iconUrl: z.string().url("La URL del icono no es valida").nullable().optional(),
});

export type CreateSkillInput = z.infer<typeof createSkillSchema>;
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>;
