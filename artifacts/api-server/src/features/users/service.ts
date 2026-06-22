import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signToken } from "@middlewares/auth";

export interface User {
  id: number;
  email: string;
  password?: string; // Only for internal use, never sent to client
  role: "user" | "admin";
  createdAt?: string;
}

export interface PublicUser {
  id: number;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
}

/**
 * UserService handles all business logic for users and authentication
 */
export class UserService {
  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<PublicUser[]> {
    const users = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable);
    return users;
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<PublicUser | null> {
    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return user || null;
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<PublicUser | null> {
    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return user || null;
  }

  /**
   * Get user with password (for authentication only)
   */
  private async getUserWithPassword(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return user || null;
  }

  /**
   * Register new user
   */
  async registerUser(
    email: string,
    password: string
  ): Promise<PublicUser | null> {
    // Check if user exists
    const existing = await this.getUserByEmail(email);
    if (existing) {
      throw new Error("Email already registered");
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    // Create user
    const [user] = await db
      .insert(usersTable)
      .values({
        email,
        password: hashed,
        role: "user",
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
      });

    return user || null;
  }

  /**
   * Login user
   */
  async loginUser(
    email: string,
    password: string
  ): Promise<{ token: string; user: PublicUser } | null> {
    const user = await this.getUserWithPassword(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password || "");
    if (!valid) {
      throw new Error("Invalid credentials");
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const publicUser: PublicUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt as string,
    };

    return { token, user: publicUser };
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(
    id: number,
    role: "user" | "admin"
  ): Promise<PublicUser | null> {
    const [updated] = await db
      .update(usersTable)
      .set({ role })
      .where(eq(usersTable.id, id))
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
      });
    return updated || null;
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(id: number): Promise<boolean> {
    await db.delete(usersTable).where(eq(usersTable.id, id));
    return true;
  }
}
