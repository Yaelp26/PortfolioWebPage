/**
 * NeonSkillRepository - Concrete implementation of SkillRepository.
 * Lives in /data. Implements the interface from /core.
 * Uses parameterized queries for SQL injection prevention.
 */
import type { Skill, CreateSkillDTO, UpdateSkillDTO } from "@/core/entities/skill";
import type { SkillRepository } from "@/core/interfaces/skill-repository";
import { sql } from "../db";

function mapRowToSkill(row: Record<string, unknown>): Skill {
  return {
    id: row.id as number,
    userId: row.user_id as number,
    name: row.name as string,
    category: row.category as string,
    proficiency: row.proficiency as number,
    iconUrl: (row.icon_url as string) || null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export class NeonSkillRepository implements SkillRepository {
  async findAll(): Promise<Skill[]> {
    const rows = await sql`SELECT * FROM skills ORDER BY category, name`;
    return rows.map(mapRowToSkill);
  }

  async findById(id: number): Promise<Skill | null> {
    const rows = await sql`SELECT * FROM skills WHERE id = ${id}`;
    if (rows.length === 0) return null;
    return mapRowToSkill(rows[0]);
  }

  async findByUserId(userId: number): Promise<Skill[]> {
    const rows = await sql`SELECT * FROM skills WHERE user_id = ${userId} ORDER BY category, name`;
    return rows.map(mapRowToSkill);
  }

  async create(data: CreateSkillDTO): Promise<Skill> {
    const rows = await sql`
      INSERT INTO skills (user_id, name, category, proficiency, icon_url)
      VALUES (${data.userId}, ${data.name}, ${data.category}, ${data.proficiency}, ${data.iconUrl ?? null})
      RETURNING *
    `;
    return mapRowToSkill(rows[0]);
  }

  async update(id: number, data: UpdateSkillDTO): Promise<Skill | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const rows = await sql`
      UPDATE skills SET
        name = ${data.name ?? existing.name},
        category = ${data.category ?? existing.category},
        proficiency = ${data.proficiency ?? existing.proficiency},
        icon_url = ${data.iconUrl !== undefined ? data.iconUrl : existing.iconUrl},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) return null;
    return mapRowToSkill(rows[0]);
  }

  async delete(id: number): Promise<boolean> {
    const rows = await sql`DELETE FROM skills WHERE id = ${id} RETURNING id`;
    return rows.length > 0;
  }
}
