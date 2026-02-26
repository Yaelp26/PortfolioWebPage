/**
 * Dependency Injection Container.
 * 
 * This is the ENTRY POINT where we wire together the layers.
 * It creates concrete repository implementations from /data
 * and injects them into services from /core.
 * 
 * This is the ONLY place where /data and /core meet.
 * The API routes (web layer) import services from here,
 * never from /data directly.
 * 
 * If the database changes (e.g., from Neon to MongoDB):
 * 1. Create new repository implementations in /data
 * 2. Update ONLY this file to use the new implementations
 * 3. /core and /web remain completely untouched
 */
import { NeonProjectRepository } from "@/data/repositories/neon-project-repository";
import { NeonSkillRepository } from "@/data/repositories/neon-skill-repository";
import { NeonExperienceRepository } from "@/data/repositories/neon-experience-repository";
import { ProjectService } from "@/core/services/project-service";
import { SkillService } from "@/core/services/skill-service";
import { ExperienceService } from "@/core/services/experience-service";

// Instantiate concrete repositories (from /data)
const projectRepository = new NeonProjectRepository();
const skillRepository = new NeonSkillRepository();
const experienceRepository = new NeonExperienceRepository();

// Inject repositories into services (from /core)
export const projectService = new ProjectService(projectRepository);
export const skillService = new SkillService(skillRepository);
export const experienceService = new ExperienceService(experienceRepository);
