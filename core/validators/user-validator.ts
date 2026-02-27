import { z } from "zod";

/**
 * Schema for creating a new user (registration).
 */
export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Formato de email inválido")
    .max(255),
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(255, "El nombre no puede exceder 255 caracteres"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
  bio: z.string().max(1000).nullable().optional(),
  avatarUrl: z.string().url("URL de avatar inválida").nullable().optional(),
  githubUrl: z.string().url("URL de GitHub inválida").nullable().optional(),
  linkedinUrl: z.string().url("URL de LinkedIn inválida").nullable().optional(),
  portfolioUrl: z
    .string()
    .url("URL de portafolio inválida")
    .nullable()
    .optional(),
});

/**
 * Schema for updating a user.
 * All fields are optional for partial updates.
 */
export const updateUserSchema = z.object({
  email: z.string().email("Formato de email inválido").max(255).optional(),
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(255, "El nombre no puede exceder 255 caracteres")
    .optional(),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres")
    .optional(),
  bio: z.string().max(1000).nullable().optional(),
  avatarUrl: z.string().url("URL de avatar inválida").nullable().optional(),
  githubUrl: z.string().url("URL de GitHub inválida").nullable().optional(),
  linkedinUrl: z.string().url("URL de LinkedIn inválida").nullable().optional(),
  portfolioUrl: z
    .string()
    .url("URL de portafolio inválida")
    .nullable()
    .optional(),
});

/**
 * Schema for user login.
 */
export const loginSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});
