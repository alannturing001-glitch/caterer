import { Router, type IRouter } from "express";
import { requireAdmin } from "@middlewares/auth";
import { MenuItemService } from "./service";
import { MenuItemController } from "./controller";

/**
 * Creates and configures the menu-items router
 */
export function createMenuItemsRouter(): IRouter {
  const router = Router();
  const service = new MenuItemService();
  const controller = new MenuItemController(service);

  // Public routes
  router.get("/menu-items", (req, res) => controller.list(req, res));
  router.get("/menu-items/:id", (req, res) => controller.getById(req, res));
  router.get("/packages/:packageId/menu-items", (req, res) =>
    controller.getByPackageId(req, res)
  );

  // Admin routes
  router.post("/menu-items", requireAdmin, (req, res) =>
    controller.create(req, res)
  );
  router.put("/menu-items/:id", requireAdmin, (req, res) =>
    controller.update(req, res)
  );
  router.delete("/menu-items/:id", requireAdmin, (req, res) =>
    controller.delete(req, res)
  );

  return router;
}

export default createMenuItemsRouter;
