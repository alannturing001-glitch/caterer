import { Request, Response } from "express";
import { AdditionalServiceService } from "./service";

/**
 * AdditionalServiceController handles HTTP request/response for additional services
 */
export class AdditionalServiceController {
  constructor(private service: AdditionalServiceService) {}

  /**
   * GET /api/additional-services
   * List all additional services
   */
  async list(_req: Request, res: Response): Promise<void> {
    try {
      const services = await this.service.getAllServices();
      res.json(services);
    } catch (error) {
      console.error("Error listing services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  }

  /**
   * GET /api/additional-services/:id
   * Get service by ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid service ID" });
        return;
      }

      const service = await this.service.getServiceById(id);

      if (!service) {
        res.status(404).json({ error: "Service not found" });
        return;
      }

      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ error: "Failed to fetch service" });
    }
  }

  /**
   * POST /api/additional-services
   * Create new service (admin only)
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, price } = req.body;

      if (!name || price === undefined) {
        res.status(400).json({ error: "Name and price are required" });
        return;
      }

      const service = await this.service.createService(req.body);
      res.status(201).json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(400).json({ error: "Failed to create service" });
    }
  }

  /**
   * PUT /api/additional-services/:id
   * Update service (admin only)
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid service ID" });
        return;
      }

      const service = await this.service.updateService(id, req.body);

      if (!service) {
        res.status(404).json({ error: "Service not found" });
        return;
      }

      res.json(service);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(400).json({ error: "Failed to update service" });
    }
  }

  /**
   * DELETE /api/additional-services/:id
   * Delete service (admin only)
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid service ID" });
        return;
      }

      const success = await this.service.deleteService(id);

      if (!success) {
        res.status(404).json({ error: "Service not found" });
        return;
      }

      res.json({ ok: true, message: "Service deleted successfully" });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ error: "Failed to delete service" });
    }
  }
}
