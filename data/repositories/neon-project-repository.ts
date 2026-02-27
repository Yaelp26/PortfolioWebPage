/**
 * NeonProjectRepository - Concrete implementation of ProjectRepository.
 * 
 * This class lives in /data and implements the interface defined in /core.
 * It depends on /core (for the interface and entities) and on the Neon
 * database client. If the database changes to MongoDB, MySQL, etc.,
 * ONLY this file needs to be replaced — the /core layer remains untouched.
 * 
 * All queries use parameterized statements to prevent SQL injection.
 */
import type { Project, CreateProjectDTO, UpdateProjectDTO } from "@/core/entities/project";
import type { ProjectRepository } from "@/core/interfaces/project-repository";
import { sql } from "../db";

/**
 * Maps a raw database row to a Project entity.
 * Converts snake_case DB columns to camelCase entity properties.
 */
function mapRowToProject(row: Record<string, unknown>): Project {
  return {
    id: row.id as number,
    userId: row.user_id as number,
    title: row.title as string,
    description: row.description as string,
    imageUrl: (row.image_url as string) || null,
    technologies: (row.technologies as string[]) || [],
    liveUrl: (row.live_url as string) || null,
    repoUrl: (row.repo_url as string) || null,
    startDate: row.start_date ? String(row.start_date) : null,
    endDate: row.end_date ? String(row.end_date) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export class NeonProjectRepository implements ProjectRepository {
  async findAll(): Promise<Project[]> {
    const rows = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
    return rows.map(mapRowToProject);
  }

  async findById(id: number): Promise<Project | null> {
    const rows = await sql`SELECT * FROM projects WHERE id = ${id}`;
    if (rows.length === 0) return null;
    return mapRowToProject(rows[0]);
  }

  async findByUserId(userId: number): Promise<Project[]> {
    const rows = await sql`SELECT * FROM projects WHERE user_id = ${userId} ORDER BY created_at DESC`;
    return rows.map(mapRowToProject);
  }

  async create(data: CreateProjectDTO): Promise<Project> {
    const rows = await sql`
      INSERT INTO projects (user_id, title, description, image_url, technologies, live_url, repo_url, start_date, end_date)
      VALUES (
        ${data.userId},
        ${data.title},
        ${data.description},
        ${data.imageUrl ?? null},
        ${data.technologies ?? []},
        ${data.liveUrl ?? null},
        ${data.repoUrl ?? null},
        ${data.startDate ?? null},
        ${data.endDate ?? null}
      )
      RETURNING *
    `;
    return mapRowToProject(rows[0]);
  }

  async update(id: number, data: UpdateProjectDTO): Promise<Project | null> {
    // Build SET clause dynamically for partial updates
    const existing = await this.findById(id);
    if (!existing) return null;

    const rows = await sql`
      UPDATE projects SET
        title = ${data.title ?? existing.title},
        description = ${data.description ?? existing.description},
        image_url = ${data.imageUrl !== undefined ? data.imageUrl : existing.imageUrl},
        technologies = ${data.technologies ?? existing.technologies},
        live_url = ${data.liveUrl !== undefined ? data.liveUrl : existing.liveUrl},
        repo_url = ${data.repoUrl !== undefined ? data.repoUrl : existing.repoUrl},
        start_date = ${data.startDate !== undefined ? data.startDate : existing.startDate},
        end_date = ${data.endDate !== undefined ? data.endDate : existing.endDate},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (rows.length === 0) return null;
    return mapRowToProject(rows[0]);
  }

  async delete(id: number): Promise<boolean> {
    const rows = await sql`DELETE FROM projects WHERE id = ${id} RETURNING id`;
    return rows.length > 0;
  }
}
