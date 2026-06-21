import { Router, type IRouter } from "express";
import { requireAdmin, requireAuth } from "@middlewares/auth";
import { UserService } from "./service";
import { UserController } from "./controller";

/**
 * Creates and configures the users router
 */
export function createUsersRouter(): IRouter {
  const router = Router();
  const service = new UserService();
  const controller = new UserController(service);

  // Public routes
  router.post("/register", (req, res) => controller.register(req, res));
  router.post("/auth/login", (req, res) => controller.login(req, res));

  // Auth required routes
  router.get("/users/email/:email", requireAuth, (req, res) =>
    controller.getByEmail(req, res)
  );

  // Admin routes
  router.get("/users", requireAdmin, (req, res) =>
    controller.list(req, res)
  );
  router.get("/users/:id", requireAdmin, (req, res) =>
    controller.getById(req, res)
  );
  router.put("/users/:id/role", requireAdmin, (req, res) =>
    controller.updateRole(req, res)
  );
  router.delete("/users/:id", requireAdmin, (req, res) =>
    controller.delete(req, res)
  );

  return router;
}

export default createUsersRouter;
