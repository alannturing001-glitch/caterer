import { Router, type IRouter } from "express";
import { requireAdmin } from "@middlewares/auth";
import { EventTypeService } from "./service";
import { EventTypeController } from "./controller";

/**
 * Creates and configures the event-types router
 */
export function createEventTypesRouter(): IRouter {
  const router = Router();
  const service = new EventTypeService();
  const controller = new EventTypeController(service);

  // Public routes
  router.get("/event-types", (req, res) => controller.list(req, res));
  router.get("/event-types/:id", (req, res) => controller.getById(req, res));

  // Admin routes
  router.post("/event-types", requireAdmin, (req, res) =>
    controller.create(req, res)
  );
  router.put("/event-types/:id", requireAdmin, (req, res) =>
    controller.update(req, res)
  );
  router.delete("/event-types/:id", requireAdmin, (req, res) =>
    controller.delete(req, res)
  );

  return router;
}

export default createEventTypesRouter;
