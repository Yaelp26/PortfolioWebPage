import type {
  User,
  PublicUser,
  CreateUserDTO,
  UpdateUserDTO,
} from "../entities/user";

/**
 * UserRepository Interface - Defines the contract for user data access.
 * Implementations live in /data layer.
 */
export interface UserRepository {
  /**
   * Find all users (public data only).
   */
  findAll(): Promise<PublicUser[]>;

  /**
   * Find a user by ID (full user data).
   */
  findById(id: number): Promise<User | null>;

  /**
   * Find a user by email (for authentication).
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Create a new user with hashed password.
   */
  create(data: CreateUserDTO, hashedPassword: string): Promise<User>;

  /**
   * Update an existing user.
   */
  update(
    id: number,
    data: UpdateUserDTO,
    hashedPassword?: string,
  ): Promise<User | null>;

  /**
   * Delete a user.
   */
  delete(id: number): Promise<boolean>;
}
