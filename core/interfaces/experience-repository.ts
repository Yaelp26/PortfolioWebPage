/**
 * ExperienceRepository Interface - Defines the contract for experience data access.
 * Lives in /core to maintain separation of concerns.
 */
import type { Experience, CreateExperienceDTO, UpdateExperienceDTO } from "../entities/experience";

export interface ExperienceRepository {
  findAll(): Promise<Experience[]>;
  findById(id: number): Promise<Experience | null>;
  create(data: CreateExperienceDTO): Promise<Experience>;
  update(id: number, data: UpdateExperienceDTO): Promise<Experience | null>;
  delete(id: number): Promise<boolean>;
}
