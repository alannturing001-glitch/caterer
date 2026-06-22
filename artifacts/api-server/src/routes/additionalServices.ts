import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { additionalServicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/additional-services", async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await db.select().from(additionalServicesTable);
    res.json(services);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.post("/additional-services", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const [service] = await db.insert(additionalServicesTable).values(req.body).returning();
    res.status(201).json(service);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.put("/additional-services/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const [service] = await db.update(additionalServicesTable).set(req.body).where(eq(additionalServicesTable.id, parseInt(id))).returning();
    res.json(service);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/additional-services/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await db.delete(additionalServicesTable).where(eq(additionalServicesTable.id, parseInt(id)));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
