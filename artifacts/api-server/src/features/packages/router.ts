import { Router, type IRouter } from "express";
import { requireAdmin } from "@middlewares/auth";
import { PackageService } from "./service";
import { PackageController } from "./controller";

/**
 * Creates and configures the packages router
 * Routes are defined with proper HTTP methods and middleware
 */
export function createPackagesRouter(): IRouter {
  const router = Router();
  const service = new PackageService();
  const controller = new PackageController(service);

  // Public routes
  router.get("/packages", (req, res) => controller.list(req, res));
  router.get("/packages/:id", (req, res) => controller.getById(req, res));
  router.get("/packages/slug/:slug", (req, res) => controller.getBySlug(req, res));
  router.get("/packages/search/:term", (req, res) => controller.search(req, res));

  // Admin routes
  router.post("/packages", requireAdmin, (req, res) => controller.create(req, res));
  router.put("/packages/:id", requireAdmin, (req, res) => controller.update(req, res));
  router.delete("/packages/:id", requireAdmin, (req, res) => controller.delete(req, res));

  return router;
}

export default createPackagesRouter;
