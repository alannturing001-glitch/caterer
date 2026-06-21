import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq, lte, ilike, and } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/products", async (req: Request, res: Response): Promise<void> => {
  try {
    const sort = req.query.sort as string | undefined;
    const page = (req.query.page as string) || "1";
    const price = req.query.price as string | undefined;
    const category = req.query.category as string | undefined;
    const inStock = req.query.inStock as string | undefined;
    const outOfStock = req.query.outOfStock as string | undefined;

    const conditions = [];
    if (price) conditions.push(lte(productsTable.price, Number(price)));
    if (category) conditions.push(eq(productsTable.category, category));
    const inStockBool = inStock === "true";
    const outOfStockBool = outOfStock === "true";
    if (inStockBool && !outOfStockBool) conditions.push(eq(productsTable.inStock, 1));
    else if (!inStockBool && outOfStockBool) conditions.push(eq(productsTable.inStock, 0));

    let query = db.select().from(productsTable);
    if (conditions.length) query = (query as any).where(and(...conditions));
    const products = await query;

    const sorted = [...products];
    if (sort === "titleAsc") sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    else if (sort === "titleDesc") sorted.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    else if (sort === "lowPrice") sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === "highPrice") sorted.sort((a, b) => (b.price || 0) - (a.price || 0));

    const pageNum = parseInt(page) || 1;
    const perPage = 12;
    const paginated = sorted.slice((pageNum - 1) * perPage, pageNum * perPage);
    res.json(paginated);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/slug/:slug", async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
    const [product] = await db.select().from(productsTable).where(eq(productsTable.slug, slug));
    if (!product) { res.status(404).json({ error: "Product not found" }); return; }
    res.json(product);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.get("/products/search/:term", async (req: Request, res: Response): Promise<void> => {
  try {
    const term = Array.isArray(req.params.term) ? req.params.term[0] : req.params.term;
    const products = await db.select().from(productsTable).where(ilike(productsTable.title, `%${term}%`));
    res.json(products);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.get("/products/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, parseInt(id)));
    if (!product) { res.status(404).json({ error: "Not found" }); return; }
    res.json(product);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.post("/products", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const [product] = await db.insert(productsTable).values(req.body).returning();
    res.status(201).json(product);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.put("/products/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const [product] = await db.update(productsTable).set(req.body).where(eq(productsTable.id, parseInt(id))).returning();
    res.json(product);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/products/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await db.delete(productsTable).where(eq(productsTable.id, parseInt(id)));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
