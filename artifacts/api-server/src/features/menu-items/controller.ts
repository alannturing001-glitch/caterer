import { Request, Response } from "express";
import { MenuItemService } from "./service";

/**
 * MenuItemController handles HTTP request/response for menu items
 */
export class MenuItemController {
  constructor(private service: MenuItemService) {}

  /**
   * GET /api/menu-items
   * List all menu items or filter by package
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const packageId = req.query.packageId
        ? Number(req.query.packageId)
        : undefined;

      const items = await this.service.getAllMenuItems(packageId);
      res.json(items);
    } catch (error) {
      console.error("Error listing menu items:", error);
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  }

  /**
   * GET /api/menu-items/:id
   * Get menu item by ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid menu item ID" });
        return;
      }

      const item = await this.service.getMenuItemById(id);

      if (!item) {
        res.status(404).json({ error: "Menu item not found" });
        return;
      }

      res.json(item);
    } catch (error) {
      console.error("Error fetching menu item:", error);
      res.status(500).json({ error: "Failed to fetch menu item" });
    }
  }

  /**
   * GET /api/packages/:packageId/menu-items
   * Get all menu items for a package
   */
  async getByPackageId(req: Request, res: Response): Promise<void> {
    try {
      const packageId = Number(req.params.packageId);

      if (isNaN(packageId)) {
        res.status(400).json({ error: "Invalid package ID" });
        return;
      }

      const items =
        await this.service.getMenuItemsByPackageId(packageId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching package menu items:", error);
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  }

  /**
   * POST /api/menu-items
   * Create new menu item (admin only)
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      if (!name) {
        res.status(400).json({ error: "Name is required" });
        return;
      }

      const item = await this.service.createMenuItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating menu item:", error);
      res.status(400).json({ error: "Failed to create menu item" });
    }
  }

  /**
   * PUT /api/menu-items/:id
   * Update menu item (admin only)
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid menu item ID" });
        return;
      }

      const item = await this.service.updateMenuItem(id, req.body);

      if (!item) {
        res.status(404).json({ error: "Menu item not found" });
        return;
      }

      res.json(item);
    } catch (error) {
      console.error("Error updating menu item:", error);
      res.status(400).json({ error: "Failed to update menu item" });
    }
  }

  /**
   * DELETE /api/menu-items/:id
   * Delete menu item (admin only)
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid menu item ID" });
        return;
      }

      const success = await this.service.deleteMenuItem(id);

      if (!success) {
        res.status(404).json({ error: "Menu item not found" });
        return;
      }

      res.json({ ok: true, message: "Menu item deleted successfully" });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  }
}
