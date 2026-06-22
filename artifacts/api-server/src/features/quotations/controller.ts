import { Request, Response } from "express";
import { QuotationService } from "./service";

/**
 * QuotationController handles HTTP request/response for quotations
 */
export class QuotationController {
  constructor(private service: QuotationService) {}

  /**
   * GET /api/quotations
   * List all quotations (admin only)
   */
  async list(_req: Request, res: Response): Promise<void> {
    try {
      const quotations = await this.service.getAllQuotations();
      res.json(quotations);
    } catch (error) {
      console.error("Error listing quotations:", error);
      res.status(500).json({ error: "Failed to fetch quotations" });
    }
  }

  /**
   * GET /api/quotations/:id
   * Get quotation by ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid quotation ID" });
        return;
      }

      const quotation = await this.service.getQuotationById(id);

      if (!quotation) {
        res.status(404).json({ error: "Quotation not found" });
        return;
      }

      res.json(quotation);
    } catch (error) {
      console.error("Error fetching quotation:", error);
      res.status(500).json({ error: "Failed to fetch quotation" });
    }
  }

  /**
   * GET /api/users/:userId/quotations
   * Get quotations by user ID
   */
  async getByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.userId);

      if (isNaN(userId)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      const quotations =
        await this.service.getQuotationsByUserId(userId);
      res.json(quotations);
    } catch (error) {
      console.error("Error fetching user quotations:", error);
      res.status(500).json({ error: "Failed to fetch quotations" });
    }
  }

  /**
   * POST /api/quotations
   * Create new quotation (public)
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const quotation = await this.service.createQuotation(req.body);
      res.status(201).json(quotation);
    } catch (error) {
      console.error("Error creating quotation:", error);
      res.status(400).json({ error: "Failed to create quotation" });
    }
  }

  /**
   * PUT /api/quotations/:id
   * Update quotation
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid quotation ID" });
        return;
      }

      const quotation = await this.service.updateQuotation(id, req.body);

      if (!quotation) {
        res.status(404).json({ error: "Quotation not found" });
        return;
      }

      res.json(quotation);
    } catch (error) {
      console.error("Error updating quotation:", error);
      res.status(400).json({ error: "Failed to update quotation" });
    }
  }

  /**
   * PUT /api/quotations/:id/status
   * Update quotation status (admin only)
   */
  async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { status } = req.body as { status?: string };

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid quotation ID" });
        return;
      }

      if (
        !status ||
        !["pending", "approved", "rejected", "completed"].includes(status)
      ) {
        res.status(400).json({ error: "Valid status is required" });
        return;
      }

      const quotation = await this.service.updateQuotationStatus(
        id,
        status as "pending" | "approved" | "rejected" | "completed"
      );

      if (!quotation) {
        res.status(404).json({ error: "Quotation not found" });
        return;
      }

      res.json(quotation);
    } catch (error) {
      console.error("Error updating quotation status:", error);
      res.status(400).json({ error: "Failed to update quotation status" });
    }
  }

  /**
   * DELETE /api/quotations/:id
   * Delete quotation (admin only)
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid quotation ID" });
        return;
      }

      const success = await this.service.deleteQuotation(id);

      if (!success) {
        res.status(404).json({ error: "Quotation not found" });
        return;
      }

      res.json({ ok: true, message: "Quotation deleted successfully" });
    } catch (error) {
      console.error("Error deleting quotation:", error);
      res.status(500).json({ error: "Failed to delete quotation" });
    }
  }
}
