/**
 * ProjectRepository Interface - Defines the contract for project data access.
 * 
 * This interface lives in /core and defines WHAT operations are available,
 * without specifying HOW they are implemented. The concrete implementation
 * lives in /data, enabling database portability.
 * 
 * If the database changes (e.g., from Neon to MongoDB), only the /data
 * implementation needs to change — this interface stays the same.
 */
import type { Project, CreateProjectDTO, UpdateProjectDTO } from "../entities/project";

export interface ProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: number): Promise<Project | null>;
  create(data: CreateProjectDTO): Promise<Project>;
  update(id: number, data: UpdateProjectDTO): Promise<Project | null>;
  delete(id: number): Promise<boolean>;
}
