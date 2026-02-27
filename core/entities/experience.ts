/**
 * Experience Entity - Domain model for work experience.
 * This entity belongs to the Core layer and has NO external dependencies.
 */
export interface Experience {
  id: number;
  userId: number;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  location: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExperienceDTO {
  userId: number;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  location?: string | null;
}

export interface UpdateExperienceDTO {
  company?: string;
  position?: string;
  description?: string;
  startDate?: string;
  endDate?: string | null;
  isCurrent?: boolean;
  location?: string | null;
}
