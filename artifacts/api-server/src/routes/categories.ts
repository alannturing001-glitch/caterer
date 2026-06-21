import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/categories", async (_req, res) => {
  try {
    const cats = await db.select().from(categoriesTable);
    res.json(cats);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.post("/categories", async (req, res) => {
  try {
    const { name } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const [cat] = await db.insert(categoriesTable).values({ name, slug }).returning();
    res.status(201).json(cat);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    await db.delete(categoriesTable).where(eq(categoriesTable.id, parseInt(req.params.id)));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
