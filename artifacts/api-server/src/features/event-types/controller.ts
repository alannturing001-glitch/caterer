import { Request, Response } from "express";
import { EventTypeService } from "./service";

/**
 * EventTypeController handles HTTP request/response for event types
 */
export class EventTypeController {
  constructor(private service: EventTypeService) {}

  /**
   * GET /api/event-types
   * List all event types
   */
  async list(_req: Request, res: Response): Promise<void> {
    try {
      const eventTypes = await this.service.getAllEventTypes();
      res.json(eventTypes);
    } catch (error) {
      console.error("Error listing event types:", error);
      res.status(500).json({ error: "Failed to fetch event types" });
    }
  }

  /**
   * GET /api/event-types/:id
   * Get event type by ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid event type ID" });
        return;
      }

      const eventType = await this.service.getEventTypeById(id);

      if (!eventType) {
        res.status(404).json({ error: "Event type not found" });
        return;
      }

      res.json(eventType);
    } catch (error) {
      console.error("Error fetching event type:", error);
      res.status(500).json({ error: "Failed to fetch event type" });
    }
  }

  /**
   * POST /api/event-types
   * Create new event type (admin only)
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, icon } = req.body as { name: string; icon?: string };

      if (!name || typeof name !== "string" || name.trim().length === 0) {
        res.status(400).json({ error: "Event type name is required" });
        return;
      }

      const eventType = await this.service.createEventType(name, icon);
      res.status(201).json(eventType);
    } catch (error) {
      console.error("Error creating event type:", error);
      res.status(400).json({ error: "Failed to create event type" });
    }
  }

  /**
   * PUT /api/event-types/:id
   * Update event type (admin only)
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid event type ID" });
        return;
      }

      const eventType = await this.service.updateEventType(id, req.body);

      if (!eventType) {
        res.status(404).json({ error: "Event type not found" });
        return;
      }

      res.json(eventType);
    } catch (error) {
      console.error("Error updating event type:", error);
      res.status(400).json({ error: "Failed to update event type" });
    }
  }

  /**
   * DELETE /api/event-types/:id
   * Delete event type (admin only)
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid event type ID" });
        return;
      }

      const success = await this.service.deleteEventType(id);

      if (!success) {
        res.status(404).json({ error: "Event type not found" });
        return;
      }

      res.json({ ok: true, message: "Event type deleted successfully" });
    } catch (error) {
      console.error("Error deleting event type:", error);
      res.status(500).json({ error: "Failed to delete event type" });
    }
  }
}
