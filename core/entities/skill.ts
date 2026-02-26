/**
 * Skill Entity - Domain model for technical skills.
 * This entity belongs to the Core layer and has NO external dependencies.
 */
export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number; // 1-100
  iconUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSkillDTO {
  name: string;
  category: string;
  proficiency: number;
  iconUrl?: string | null;
}

export interface UpdateSkillDTO {
  name?: string;
  category?: string;
  proficiency?: number;
  iconUrl?: string | null;
}
