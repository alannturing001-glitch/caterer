import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin, requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/orders", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
    res.json(orders);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.post("/orders", async (req: Request, res: Response): Promise<void> => {
  try {
    const [order] = await db.insert(ordersTable).values(req.body).returning();
    res.status(201).json(order);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.put("/orders/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const [order] = await db.update(ordersTable).set(req.body).where(eq(ordersTable.id, parseInt(id))).returning();
    res.json(order);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
