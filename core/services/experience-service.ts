/**
 * ExperienceService - Business logic for managing work experiences.
 * Receives its repository via constructor injection (Repository Pattern).
 * Depends only on /core interfaces and validators.
 */
import type { Experience, CreateExperienceDTO, UpdateExperienceDTO } from "../entities/experience";
import type { ExperienceRepository } from "../interfaces/experience-repository";
import { createExperienceSchema, updateExperienceSchema } from "../validators/experience-validator";

export class ExperienceService {
  constructor(private readonly repository: ExperienceRepository) {}

  async getAllExperiences(): Promise<Experience[]> {
    return this.repository.findAll();
  }

  async getExperienceById(id: number): Promise<Experience | null> {
    return this.repository.findById(id);
  }

  async createExperience(data: CreateExperienceDTO): Promise<Experience> {
    const validated = createExperienceSchema.parse(data);
    return this.repository.create(validated);
  }

  async updateExperience(id: number, data: UpdateExperienceDTO): Promise<Experience | null> {
    const validated = updateExperienceSchema.parse(data);
    return this.repository.update(id, validated);
  }

  async deleteExperience(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}
