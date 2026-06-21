import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { menuItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/menu-items", async (req: Request, res: Response): Promise<void> => {
  try {
    const packageId = req.query.packageId as string | undefined;
    let items;
    if (packageId) {
      items = await db.select().from(menuItemsTable).where(eq(menuItemsTable.packageId, parseInt(packageId)));
    } else {
      items = await db.select().from(menuItemsTable);
    }
    res.json(items);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.post("/menu-items", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const [item] = await db.insert(menuItemsTable).values(req.body).returning();
    res.status(201).json(item);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.put("/menu-items/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const [item] = await db.update(menuItemsTable).set(req.body).where(eq(menuItemsTable.id, parseInt(id))).returning();
    res.json(item);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/menu-items/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await db.delete(menuItemsTable).where(eq(menuItemsTable.id, parseInt(id)));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
