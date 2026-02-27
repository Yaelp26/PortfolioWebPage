/**
 * User Entity - Domain model for system users.
 * This entity belongs to the Core layer and has NO external dependencies.
 * Represents a user who can create and manage their portfolio/resume.
 */
export interface User {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
  bio: string | null;
  avatarUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Public User - Version of User without sensitive data.
 * Used for displaying user information publicly.
 */
export interface PublicUser {
  id: number;
  email: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  createdAt: string;
}

/**
 * DTO for creating a new user (registration).
 * Includes plain password which will be hashed.
 */
export interface CreateUserDTO {
  email: string;
  name: string;
  password: string;
  bio?: string | null;
  avatarUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
}

/**
 * DTO for updating an existing user.
 * All fields are optional to support partial updates.
 */
export interface UpdateUserDTO {
  email?: string;
  name?: string;
  password?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
}

/**
 * DTO for user authentication.
 */
export interface LoginDTO {
  email: string;
  password: string;
}
