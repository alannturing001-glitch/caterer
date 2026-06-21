import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq, lte, gte, ilike, and, or } from "drizzle-orm";

const router = Router();

router.get("/products", async (req, res) => {
  try {
    const { sort, page = "1", filters } = req.query as any;
    let query = db.select().from(productsTable);
    const conditions = [];
    if (filters?.price?.$lte) conditions.push(lte(productsTable.price, Number(filters.price.$lte)));
    if (filters?.category?.$equals) conditions.push(eq(productsTable.category, filters.category.$equals));
    if (conditions.length) query = (query as any).where(and(...conditions));
    const products = await query;
    let sorted = products;
    if (sort === "titleAsc") sorted = products.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    else if (sort === "titleDesc") sorted = products.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    else if (sort === "lowPrice") sorted = products.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === "highPrice") sorted = products.sort((a, b) => (b.price || 0) - (a.price || 0));
    const pageNum = parseInt(page) || 1;
    const perPage = 12;
    const paginated = sorted.slice((pageNum - 1) * perPage, pageNum * perPage);
    res.json(paginated);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/slug/:slug", async (req, res) => {
  try {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.slug, req.params.slug));
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.get("/products/search/:term", async (req, res) => {
  try {
    const products = await db.select().from(productsTable).where(ilike(productsTable.title, `%${req.params.term}%`));
    res.json(products);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.get("/products/:id", async (req, res) => {
  try {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, parseInt(req.params.id)));
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.post("/products", async (req, res) => {
  try {
    const [product] = await db.insert(productsTable).values(req.body).returning();
    res.status(201).json(product);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.put("/products/:id", async (req, res) => {
  try {
    const [product] = await db.update(productsTable).set(req.body).where(eq(productsTable.id, parseInt(req.params.id))).returning();
    res.json(product);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.delete("/products/:id", async (req, res) => {
  try {
    await db.delete(productsTable).where(eq(productsTable.id, parseInt(req.params.id)));
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
