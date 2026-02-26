/**
 * Database Client - Neon serverless PostgreSQL connection.
 * 
 * This module belongs to the /data layer and provides the database connection.
 * It reads from the DATABASE_URL environment variable, which can point to
 * a local or cloud database. Changing the database provider only requires
 * modifying this file and the repository implementations.
 */
import { neon } from "@neondatabase/serverless";

/**
 * Creates and exports a reusable SQL client connected to the Neon database.
 * The connection string comes from environment variables for portability.
 */
export const sql = neon(process.env.DATABASE_URL!);
