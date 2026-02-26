/**
 * ProjectService - Business logic for managing projects.
 * 
 * This service lives in /core and depends ONLY on:
 * - Core entities (Project, DTOs)
 * - Core interfaces (ProjectRepository)
 * - Core validators
 * 
 * It receives the repository through constructor injection (Dependency Injection),
 * which means it never knows the concrete implementation. This is the key
 * to the Repository Pattern: the service works with ANY implementation
 * that satisfies the ProjectRepository interface.
 */
import type { Project, CreateProjectDTO, UpdateProjectDTO } from "../entities/project";
import type { ProjectRepository } from "../interfaces/project-repository";
import { createProjectSchema, updateProjectSchema } from "../validators/project-validator";

export class ProjectService {
  // The repository is injected — the service doesn't know if it's Neon, MongoDB, or in-memory
  constructor(private readonly repository: ProjectRepository) {}

  async getAllProjects(): Promise<Project[]> {
    return this.repository.findAll();
  }

  async getProjectById(id: number): Promise<Project | null> {
    return this.repository.findById(id);
  }

  async createProject(data: CreateProjectDTO): Promise<Project> {
    // Validate business rules before persisting
    const validated = createProjectSchema.parse(data);
    return this.repository.create(validated);
  }

  async updateProject(id: number, data: UpdateProjectDTO): Promise<Project | null> {
    // Validate partial update data
    const validated = updateProjectSchema.parse(data);
    return this.repository.update(id, validated);
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}
