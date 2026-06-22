import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { productsTable, ordersTable, usersTable } from "@workspace/db";
import { count, sum } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/admin/stats", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const [productsCount] = await db.select({ count: count() }).from(productsTable);
    const [ordersCount] = await db.select({ count: count() }).from(ordersTable);
    const [usersCount] = await db.select({ count: count() }).from(usersTable);
    const [revenueResult] = await db.select({ total: sum(ordersTable.total) }).from(ordersTable);
    res.json({
      products: productsCount?.count || 0,
      orders: ordersCount?.count || 0,
      users: usersCount?.count || 0,
      revenue: Math.round(Number(revenueResult?.total) || 0),
    });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
