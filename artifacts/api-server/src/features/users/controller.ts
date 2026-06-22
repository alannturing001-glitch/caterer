import { Request, Response } from "express";
import { UserService, type PublicUser } from "./service";
import { AuthenticatedRequest } from "@middlewares/auth";

/**
 * UserController handles HTTP request/response for users
 */
export class UserController {
  constructor(private service: UserService) {}

  /**
   * GET /api/users
   * List all users (admin only)
   */
  async list(_req: Request, res: Response): Promise<void> {
    try {
      const users = await this.service.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error listing users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }

  /**
   * GET /api/users/:id
   * Get user by ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      const user = await this.service.getUserById(id);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  /**
   * GET /api/users/email/:email
   * Get user by email
   */
  async getByEmail(req: Request, res: Response): Promise<void> {
    try {
      const email = Array.isArray(req.params.email)
        ? req.params.email[0]
        : req.params.email;

      if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
      }

      const caller = (req as AuthenticatedRequest).user;
      if (!caller || (caller.email !== email && caller.role !== "admin")) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const user = await this.service.getUserByEmail(email);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user by email:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }

  /**
   * POST /api/register
   * Register new user (public)
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as {
        email?: string;
        password?: string;
      };

      if (!email || !password) {
        res
          .status(400)
          .json({ error: "Email and password are required" });
        return;
      }

      if (password.length < 6) {
        res
          .status(400)
          .json({ error: "Password must be at least 6 characters" });
        return;
      }

      const user = await this.service.registerUser(email, password);
      res.status(201).json({ user });
    } catch (error: any) {
      console.error("Error registering user:", error);
      if (error.message === "Email already registered") {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Failed to register user" });
      }
    }
  }

  /**
   * POST /api/auth/login
   * Login user (public)
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as {
        email?: string;
        password?: string;
      };

      if (!email || !password) {
        res
          .status(400)
          .json({ error: "Email and password are required" });
        return;
      }

      const result = await this.service.loginUser(email, password);

      if (!result) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      res.json(result);
    } catch (error: any) {
      console.error("Error logging in:", error);
      res.status(401).json({ error: error.message || "Invalid credentials" });
    }
  }

  /**
   * PUT /api/users/:id/role
   * Update user role (admin only)
   */
  async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { role } = req.body as { role?: string };

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      if (!role || !["user", "admin"].includes(role)) {
        res.status(400).json({ error: "Valid role is required" });
        return;
      }

      const user = await this.service.updateUserRole(
        id,
        role as "user" | "admin"
      );

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(400).json({ error: "Failed to update user role" });
    }
  }

  /**
   * DELETE /api/users/:id
   * Delete user (admin only)
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      const success = await this.service.deleteUser(id);

      if (!success) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ ok: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
}
