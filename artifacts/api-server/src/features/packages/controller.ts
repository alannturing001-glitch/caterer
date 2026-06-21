import { Request, Response } from "express";
import { PackageService } from "./service";

/**
 * PackageController handles HTTP request/response for packages
 * Controllers translate HTTP requests to service calls
 */
export class PackageController {
  constructor(private service: PackageService) {}

  /**
   * GET /api/packages
   * List all packages with optional filters and pagination
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        sort: (req.query.sort as string) || undefined,
        price: req.query.price ? Number(req.query.price) : undefined,
        category: (req.query.category as string) || undefined,
        inStock: req.query.inStock === "true",
        outOfStock: req.query.outOfStock === "true",
      };

      const packages = await this.service.getAllPackages(filters);
      
      // Apply pagination in controller (optional, can be done in service)
      const page = parseInt((req.query.page as string) || "1");
      const perPage = 12;
      const paginated = packages.slice((page - 1) * perPage, page * perPage);

      res.json(paginated);
    } catch (error) {
      console.error("Error listing packages:", error);
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  }

  /**
   * GET /api/packages/:id
   * Get single package by ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid package ID" });
        return;
      }

      const pkg = await this.service.getPackageById(id);

      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }

      res.json(pkg);
    } catch (error) {
      console.error("Error fetching package:", error);
      res.status(500).json({ error: "Failed to fetch package" });
    }
  }

  /**
   * GET /api/packages/slug/:slug
   * Get package by slug (SEO-friendly)
   */
  async getBySlug(req: Request, res: Response): Promise<void> {
    try {
      const slug = Array.isArray(req.params.slug)
        ? req.params.slug[0]
        : req.params.slug;

      if (!slug) {
        res.status(400).json({ error: "Slug parameter is required" });
        return;
      }

      const pkg = await this.service.getPackageBySlug(slug);

      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }

      res.json(pkg);
    } catch (error) {
      console.error("Error fetching package by slug:", error);
      res.status(500).json({ error: "Failed to fetch package" });
    }
  }

  /**
   * GET /api/packages/search/:term
   * Search packages by title
   */
  async search(req: Request, res: Response): Promise<void> {
    try {
      const term = Array.isArray(req.params.term)
        ? req.params.term[0]
        : req.params.term;

      if (!term || term.length < 2) {
        res.status(400).json({ error: "Search term must be at least 2 characters" });
        return;
      }

      const packages = await this.service.searchPackages(term);
      res.json(packages);
    } catch (error) {
      console.error("Error searching packages:", error);
      res.status(500).json({ error: "Failed to search packages" });
    }
  }

  /**
   * POST /api/packages
   * Create new package (admin only)
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const pkg = await this.service.createPackage(req.body);
      res.status(201).json(pkg);
    } catch (error) {
      console.error("Error creating package:", error);
      res.status(400).json({ error: "Failed to create package" });
    }
  }

  /**
   * PUT /api/packages/:id
   * Update existing package (admin only)
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid package ID" });
        return;
      }

      const pkg = await this.service.updatePackage(id, req.body);

      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }

      res.json(pkg);
    } catch (error) {
      console.error("Error updating package:", error);
      res.status(400).json({ error: "Failed to update package" });
    }
  }

  /**
   * DELETE /api/packages/:id
   * Delete package (admin only)
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid package ID" });
        return;
      }

      const success = await this.service.deletePackage(id);

      if (!success) {
        res.status(404).json({ error: "Package not found" });
        return;
      }

      res.json({ ok: true, message: "Package deleted successfully" });
    } catch (error) {
      console.error("Error deleting package:", error);
      res.status(500).json({ error: "Failed to delete package" });
    }
  }
}
