import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { categoriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/categories", async (_req: Request, res: Response): Promise<void> => {
  try {
    const cats = await db.select().from(categoriesTable);
    res.json(cats);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.post("/categories", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body as { name: string };
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const [cat] = await db.insert(categoriesTable).values({ name, slug }).returning();
    res.status(201).json(cat);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/categories/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await db.delete(categoriesTable).where(eq(categoriesTable.id, parseInt(id)));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
