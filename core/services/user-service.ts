import type {
  User,
  PublicUser,
  CreateUserDTO,
  UpdateUserDTO,
  LoginDTO,
} from "../entities/user";
import type { UserRepository } from "../interfaces/user-repository";
import {
  createUserSchema,
  updateUserSchema,
  loginSchema,
} from "../validators/user-validator";
import * as bcrypt from "bcryptjs";

/**
 * UserService - Business logic for managing users.
 * Receives repository through dependency injection.
 */
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  /**
   * Get all users (public data only).
   */
  async getAllUsers(): Promise<PublicUser[]> {
    return this.repository.findAll();
  }

  /**
   * Get a user by ID (full data, for authorized requests).
   */
  async getUserById(id: number): Promise<User | null> {
    return this.repository.findById(id);
  }

  /**
   * Get a user's public data.
   */
  async getPublicUserById(id: number): Promise<PublicUser | null> {
    const user = await this.repository.findById(id);
    if (!user) return null;

    // Return only public fields
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }

  /**
   * Register a new user.
   */
  async createUser(data: CreateUserDTO): Promise<PublicUser> {
    // Validate input
    const validated = createUserSchema.parse(data);

    // Check if email already exists
    const existingUser = await this.repository.findByEmail(validated.email);
    if (existingUser) {
      throw new Error("El email ya está registrado");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create user
    const user = await this.repository.create(validated, hashedPassword);

    // Return public data only
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }

  /**
   * Update a user.
   */
  async updateUser(
    id: number,
    data: UpdateUserDTO,
  ): Promise<PublicUser | null> {
    // Validate input
    const validated = updateUserSchema.parse(data);

    // If updating email, check it's not already taken
    if (validated.email) {
      const existingUser = await this.repository.findByEmail(validated.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error("El email ya está registrado");
      }
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (validated.password) {
      hashedPassword = await bcrypt.hash(validated.password, 10);
    }

    // Update user
    const user = await this.repository.update(id, validated, hashedPassword);
    if (!user) return null;

    // Return public data only
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }

  /**
   * Delete a user.
   */
  async deleteUser(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }

  /**
   * Authenticate a user (for login).
   * Returns the user if credentials are valid, null otherwise.
   */
  async authenticate(credentials: LoginDTO): Promise<PublicUser | null> {
    // Validate input
    const validated = loginSchema.parse(credentials);

    // Find user by email
    const user = await this.repository.findByEmail(validated.email);
    if (!user) return null;

    // Verify password
    const isValidPassword = await bcrypt.compare(
      validated.password,
      user.passwordHash,
    );
    if (!isValidPassword) return null;

    // Return public data only
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }
}
