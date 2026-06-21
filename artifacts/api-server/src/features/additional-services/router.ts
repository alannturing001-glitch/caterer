import { Router, type IRouter } from "express";
import { requireAdmin } from "@middlewares/auth";
import { AdditionalServiceService } from "./service";
import { AdditionalServiceController } from "./controller";

/**
 * Creates and configures the additional-services router
 */
export function createAdditionalServicesRouter(): IRouter {
  const router = Router();
  const service = new AdditionalServiceService();
  const controller = new AdditionalServiceController(service);

  // Public routes
  router.get("/additional-services", (req, res) =>
    controller.list(req, res)
  );
  router.get("/additional-services/:id", (req, res) =>
    controller.getById(req, res)
  );

  // Admin routes
  router.post("/additional-services", requireAdmin, (req, res) =>
    controller.create(req, res)
  );
  router.put("/additional-services/:id", requireAdmin, (req, res) =>
    controller.update(req, res)
  );
  router.delete("/additional-services/:id", requireAdmin, (req, res) =>
    controller.delete(req, res)
  );

  return router;
}

export default createAdditionalServicesRouter;
