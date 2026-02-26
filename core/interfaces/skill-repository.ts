/**
 * SkillRepository Interface - Defines the contract for skill data access.
 * Lives in /core to maintain separation of concerns.
 */
import type { Skill, CreateSkillDTO, UpdateSkillDTO } from "../entities/skill";

export interface SkillRepository {
  findAll(): Promise<Skill[]>;
  findById(id: number): Promise<Skill | null>;
  create(data: CreateSkillDTO): Promise<Skill>;
  update(id: number, data: UpdateSkillDTO): Promise<Skill | null>;
  delete(id: number): Promise<boolean>;
}
