/**
 * Project Validator - Business rule validation for projects.
 * 
 * This module validates data integrity at the domain level.
 * It uses Zod for schema validation but contains NO database or HTTP code.
 * All validation rules are pure business logic.
 */
import { z } from "zod";

// Allowed image formats for project images
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

/**
 * Validates that an image URL has an allowed file format.
 */
function isValidImageUrl(url: string): boolean {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return ALLOWED_IMAGE_EXTENSIONS.some((ext) => pathname.endsWith(ext));
  } catch {
    // If it's not a valid URL, reject it
    return false;
  }
}

/**
 * Validates that the end date is after the start date.
 */
function isEndDateAfterStart(startDate: string | null | undefined, endDate: string | null | undefined): boolean {
  if (!startDate || !endDate) return true;
  return new Date(endDate) >= new Date(startDate);
}

export const createProjectSchema = z
  .object({
    userId: z.number().int().positive("El ID de usuario debe ser un numero positivo"),
    title: z.string().min(1, "El titulo es obligatorio").max(255, "El titulo no puede exceder 255 caracteres"),
    description: z.string().min(1, "La descripcion es obligatoria"),
    imageUrl: z
      .string()
      .refine((url) => isValidImageUrl(url), {
        message: `El formato de imagen debe ser: ${ALLOWED_IMAGE_EXTENSIONS.join(", ")}`,
      })
      .nullable()
      .optional(),
    technologies: z.array(z.string()).optional().default([]),
    liveUrl: z.string().url("La URL del sitio no es valida").nullable().optional(),
    repoUrl: z.string().url("La URL del repositorio no es valida").nullable().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
  })
  .refine((data) => isEndDateAfterStart(data.startDate, data.endDate), {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["endDate"],
  });

export const updateProjectSchema = z
  .object({
    title: z.string().min(1, "El titulo es obligatorio").max(255, "El titulo no puede exceder 255 caracteres").optional(),
    description: z.string().min(1, "La descripcion es obligatoria").optional(),
    imageUrl: z
      .string()
      .refine((url) => isValidImageUrl(url), {
        message: `El formato de imagen debe ser: ${ALLOWED_IMAGE_EXTENSIONS.join(", ")}`,
      })
      .nullable()
      .optional(),
    technologies: z.array(z.string()).optional(),
    liveUrl: z.string().url("La URL del sitio no es valida").nullable().optional(),
    repoUrl: z.string().url("La URL del repositorio no es valida").nullable().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
  })
  .refine((data) => isEndDateAfterStart(data.startDate, data.endDate), {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["endDate"],
  });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
