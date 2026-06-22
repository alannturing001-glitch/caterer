import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { requireAdmin, requireAuth, signToken } from "../middlewares/auth";

const router = Router();

router.get("/users", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await db.select({ id: usersTable.id, email: usersTable.email, role: usersTable.role, createdAt: usersTable.createdAt }).from(usersTable);
    res.json(users);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.get("/users/:id", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const [user] = await db.select({ id: usersTable.id, email: usersTable.email, role: usersTable.role }).from(usersTable).where(eq(usersTable.id, parseInt(id)));
    if (!user) { res.status(404).json({ error: "Not found" }); return; }
    res.json(user);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.get("/users/email/:email", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const email = Array.isArray(req.params.email) ? req.params.email[0] : req.params.email;
    const [user] = await db.select({ id: usersTable.id, email: usersTable.email, role: usersTable.role }).from(usersTable).where(eq(usersTable.email, email));
    if (!user) { res.status(404).json({ error: "Not found" }); return; }
    res.json(user);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) { res.status(400).json({ error: "Email and password required" }); return; }
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing) { res.status(400).json({ error: "Email already exists" }); return; }
    const hashed = await bcrypt.hash(password, 12);
    const [user] = await db.insert(usersTable).values({ email, password: hashed, role: "user" }).returning({ id: usersTable.id, email: usersTable.email, role: usersTable.role });
    res.status(201).json({ user });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.post("/auth/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) { res.status(400).json({ error: "Email and password required" }); return; }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) { res.status(401).json({ error: "Invalid credentials" }); return; }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) { res.status(401).json({ error: "Invalid credentials" }); return; }
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({ token });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
