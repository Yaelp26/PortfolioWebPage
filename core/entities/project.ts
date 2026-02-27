/**
 * Project Entity - Domain model for portfolio projects.
 * This entity belongs to the Core layer and has NO external dependencies.
 * It represents a pure business object with typed properties.
 */
export interface Project {
  id: number;
  userId: number;
  title: string;
  description: string;
  imageUrl: string | null;
  technologies: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for creating a new project.
 * Excludes auto-generated fields (id, createdAt, updatedAt).
 */
export interface CreateProjectDTO {
  userId: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  technologies?: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

/**
 * DTO for updating an existing project.
 * All fields are optional to support partial updates.
 */
export interface UpdateProjectDTO {
  title?: string;
  description?: string;
  imageUrl?: string | null;
  technologies?: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}
