import { Router, type IRouter } from "express";
import { requireAdmin, requireAuth } from "@middlewares/auth";
import { QuotationService } from "./service";
import { QuotationController } from "./controller";

/**
 * Creates and configures the quotations router
 */
export function createQuotationsRouter(): IRouter {
  const router = Router();
  const service = new QuotationService();
  const controller = new QuotationController(service);

  // Public routes
  router.post("/quotations", (req, res) =>
    controller.create(req, res)
  );

  // Auth required routes
  router.get("/users/:userId/quotations", requireAuth, (req, res) =>
    controller.getByUserId(req, res)
  );

  // Admin routes
  router.get("/quotations", requireAdmin, (req, res) =>
    controller.list(req, res)
  );
  router.get("/quotations/:id", requireAdmin, (req, res) =>
    controller.getById(req, res)
  );
  router.put("/quotations/:id", requireAdmin, (req, res) =>
    controller.update(req, res)
  );
  router.put("/quotations/:id/status", requireAdmin, (req, res) =>
    controller.updateStatus(req, res)
  );
  router.delete("/quotations/:id", requireAdmin, (req, res) =>
    controller.delete(req, res)
  );

  return router;
}

export default createQuotationsRouter;
