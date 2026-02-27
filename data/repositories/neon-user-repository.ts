import { sql } from "@/data/db";
import type {
  User,
  PublicUser,
  CreateUserDTO,
  UpdateUserDTO,
} from "@/core/entities/user";
import type { UserRepository } from "@/core/interfaces/user-repository";

/**
 * NeonUserRepository - PostgreSQL (Neon) implementation of UserRepository.
 * Implements all data access operations for users using SQL queries.
 */
export class NeonUserRepository implements UserRepository {
  /**
   * Get all users (public data only).
   */
  async findAll(): Promise<PublicUser[]> {
    const result = await sql`
      SELECT 
        id, 
        email, 
        name, 
        bio, 
        avatar_url, 
        github_url, 
        linkedin_url, 
        portfolio_url, 
        created_at
      FROM users
      ORDER BY created_at DESC
    `;

    return result.map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      bio: row.bio,
      avatarUrl: row.avatar_url,
      githubUrl: row.github_url,
      linkedinUrl: row.linkedin_url,
      portfolioUrl: row.portfolio_url,
      createdAt: row.created_at,
    }));
  }

  /**
   * Get a user by ID (full data).
   */
  async findById(id: number): Promise<User | null> {
    const result = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;

    if (result.length === 0) return null;

    const row = result[0];
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      passwordHash: row.password_hash,
      bio: row.bio,
      avatarUrl: row.avatar_url,
      githubUrl: row.github_url,
      linkedinUrl: row.linkedin_url,
      portfolioUrl: row.portfolio_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Get a user by email (for authentication).
   */
  async findByEmail(email: string): Promise<User | null> {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (result.length === 0) return null;

    const row = result[0];
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      passwordHash: row.password_hash,
      bio: row.bio,
      avatarUrl: row.avatar_url,
      githubUrl: row.github_url,
      linkedinUrl: row.linkedin_url,
      portfolioUrl: row.portfolio_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Create a new user.
   */
  async create(
    data: CreateUserDTO,
    hashedPassword: string,
  ): Promise<User> {
    const result = await sql`
      INSERT INTO users (
        email, 
        name, 
        password_hash, 
        bio, 
        avatar_url, 
        github_url, 
        linkedin_url, 
        portfolio_url
      )
      VALUES (
        ${data.email}, 
        ${data.name}, 
        ${hashedPassword}, 
        ${data.bio ?? null}, 
        ${data.avatarUrl ?? null}, 
        ${data.githubUrl ?? null}, 
        ${data.linkedinUrl ?? null}, 
        ${data.portfolioUrl ?? null}
      )
      RETURNING *
    `;

    const row = result[0];
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      passwordHash: row.password_hash,
      bio: row.bio,
      avatarUrl: row.avatar_url,
      githubUrl: row.github_url,
      linkedinUrl: row.linkedin_url,
      portfolioUrl: row.portfolio_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Update a user.
   */
  async update(
    id: number,
    data: UpdateUserDTO,
    hashedPassword?: string,
  ): Promise<User | null> {
    // Get existing user
    const existing = await this.findById(id);
    if (!existing) return null;

    const result = await sql`
      UPDATE users 
      SET 
        email = ${data.email ?? existing.email},
        name = ${data.name ?? existing.name},
        password_hash = ${hashedPassword ?? existing.passwordHash},
        bio = ${data.bio !== undefined ? data.bio : existing.bio},
        avatar_url = ${data.avatarUrl !== undefined ? data.avatarUrl : existing.avatarUrl},
        github_url = ${data.githubUrl !== undefined ? data.githubUrl : existing.githubUrl},
        linkedin_url = ${data.linkedinUrl !== undefined ? data.linkedinUrl : existing.linkedinUrl},
        portfolio_url = ${data.portfolioUrl !== undefined ? data.portfolioUrl : existing.portfolioUrl},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) return null;

    const row = result[0];
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      passwordHash: row.password_hash,
      bio: row.bio,
      avatarUrl: row.avatar_url,
      githubUrl: row.github_url,
      linkedinUrl: row.linkedin_url,
      portfolioUrl: row.portfolio_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Delete a user.
   */
  async delete(id: number): Promise<boolean> {
    const result = await sql`
      DELETE FROM users WHERE id = ${id} RETURNING id
    `;
    return result.length > 0;
  }
}
