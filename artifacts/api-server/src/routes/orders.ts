import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/orders", async (_req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
    res.json(orders);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.post("/orders", async (req, res) => {
  try {
    const [order] = await db.insert(ordersTable).values(req.body).returning();
    res.status(201).json(order);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.put("/orders/:id", async (req, res) => {
  try {
    const [order] = await db.update(ordersTable).set(req.body).where(eq(ordersTable.id, parseInt(req.params.id))).returning();
    res.json(order);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
