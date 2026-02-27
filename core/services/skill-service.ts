/**
 * SkillService - Business logic for managing skills.
 * Receives its repository via constructor injection (Repository Pattern).
 * Depends only on /core interfaces and validators.
 */
import type { Skill, CreateSkillDTO, UpdateSkillDTO } from "../entities/skill";
import type { SkillRepository } from "../interfaces/skill-repository";
import { createSkillSchema, updateSkillSchema } from "../validators/skill-validator";

export class SkillService {
  constructor(private readonly repository: SkillRepository) {}

  async getAllSkills(): Promise<Skill[]> {
    return this.repository.findAll();
  }

  async getSkillById(id: number): Promise<Skill | null> {
    return this.repository.findById(id);
  }

  async getSkillsByUserId(userId: number): Promise<Skill[]> {
    return this.repository.findByUserId(userId);
  }

  async createSkill(data: CreateSkillDTO): Promise<Skill> {
    const validated = createSkillSchema.parse(data);
    return this.repository.create(validated);
  }

  async updateSkill(id: number, data: UpdateSkillDTO): Promise<Skill | null> {
    const validated = updateSkillSchema.parse(data);
    return this.repository.update(id, validated);
  }

  async deleteSkill(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}
