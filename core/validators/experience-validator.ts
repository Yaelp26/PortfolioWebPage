/**
 * Experience Validator - Business rule validation for work experience.
 * Pure domain validation: validates dates and business rules.
 */
import { z } from "zod";

export const createExperienceSchema = z
  .object({
    company: z.string().min(1, "La empresa es obligatoria").max(255, "La empresa no puede exceder 255 caracteres"),
    position: z.string().min(1, "El puesto es obligatorio").max(255, "El puesto no puede exceder 255 caracteres"),
    description: z.string().min(1, "La descripcion es obligatoria"),
    startDate: z.string().min(1, "La fecha de inicio es obligatoria"),
    endDate: z.string().nullable().optional(),
    isCurrent: z.boolean().optional().default(false),
    location: z.string().max(255).nullable().optional(),
  })
  .refine(
    (data) => {
      // If not current, end date should be present
      if (!data.isCurrent && !data.endDate) {
        return true; // Allow it, but recommend providing endDate
      }
      return true;
    },
    { message: "Proporcione una fecha de fin o marque como puesto actual" }
  )
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "La fecha de fin debe ser posterior a la fecha de inicio",
      path: ["endDate"],
    }
  );

export const updateExperienceSchema = z
  .object({
    company: z.string().min(1).max(255).optional(),
    position: z.string().min(1).max(255).optional(),
    description: z.string().min(1).optional(),
    startDate: z.string().optional(),
    endDate: z.string().nullable().optional(),
    isCurrent: z.boolean().optional(),
    location: z.string().max(255).nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "La fecha de fin debe ser posterior a la fecha de inicio",
      path: ["endDate"],
    }
  );

export type CreateExperienceInput = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceInput = z.infer<typeof updateExperienceSchema>;
