/**
 * NeonExperienceRepository - Concrete implementation of ExperienceRepository.
 * Lives in /data. Implements the interface from /core.
 * Uses parameterized queries for SQL injection prevention.
 */
import type { Experience, CreateExperienceDTO, UpdateExperienceDTO } from "@/core/entities/experience";
import type { ExperienceRepository } from "@/core/interfaces/experience-repository";
import { sql } from "../db";

function mapRowToExperience(row: Record<string, unknown>): Experience {
  return {
    id: row.id as number,
    company: row.company as string,
    position: row.position as string,
    description: row.description as string,
    startDate: String(row.start_date),
    endDate: row.end_date ? String(row.end_date) : null,
    isCurrent: (row.is_current as boolean) || false,
    location: (row.location as string) || null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export class NeonExperienceRepository implements ExperienceRepository {
  async findAll(): Promise<Experience[]> {
    const rows = await sql`SELECT * FROM experiences ORDER BY start_date DESC`;
    return rows.map(mapRowToExperience);
  }

  async findById(id: number): Promise<Experience | null> {
    const rows = await sql`SELECT * FROM experiences WHERE id = ${id}`;
    if (rows.length === 0) return null;
    return mapRowToExperience(rows[0]);
  }

  async create(data: CreateExperienceDTO): Promise<Experience> {
    const rows = await sql`
      INSERT INTO experiences (company, position, description, start_date, end_date, is_current, location)
      VALUES (
        ${data.company},
        ${data.position},
        ${data.description},
        ${data.startDate},
        ${data.endDate ?? null},
        ${data.isCurrent ?? false},
        ${data.location ?? null}
      )
      RETURNING *
    `;
    return mapRowToExperience(rows[0]);
  }

  async update(id: number, data: UpdateExperienceDTO): Promise<Experience | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const rows = await sql`
      UPDATE experiences SET
        company = ${data.company ?? existing.company},
        position = ${data.position ?? existing.position},
        description = ${data.description ?? existing.description},
        start_date = ${data.startDate ?? existing.startDate},
        end_date = ${data.endDate !== undefined ? data.endDate : existing.endDate},
        is_current = ${data.isCurrent !== undefined ? data.isCurrent : existing.isCurrent},
        location = ${data.location !== undefined ? data.location : existing.location},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) return null;
    return mapRowToExperience(rows[0]);
  }

  async delete(id: number): Promise<boolean> {
    const rows = await sql`DELETE FROM experiences WHERE id = ${id} RETURNING id`;
    return rows.length > 0;
  }
}
