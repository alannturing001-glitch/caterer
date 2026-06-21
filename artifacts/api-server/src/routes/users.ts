import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import * as crypto from "crypto";

const router = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

router.get("/users", async (_req, res) => {
  try {
    const users = await db.select({ id: usersTable.id, email: usersTable.email, role: usersTable.role, createdAt: usersTable.createdAt }).from(usersTable);
    res.json(users);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.get("/users/:id", async (req, res) => {
  try {
    const [user] = await db.select({ id: usersTable.id, email: usersTable.email, role: usersTable.role }).from(usersTable).where(eq(usersTable.id, parseInt(req.params.id)));
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.get("/users/email/:email", async (req, res) => {
  try {
    const [user] = await db.select({ id: usersTable.id, email: usersTable.email, role: usersTable.role }).from(usersTable).where(eq(usersTable.email, req.params.email));
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing) return res.status(400).json({ error: "Email already exists" });
    const [user] = await db.insert(usersTable).values({ email, password: hashPassword(password), role: "user" }).returning({ id: usersTable.id, email: usersTable.email, role: usersTable.role });
    res.status(201).json({ user });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user || user.password !== hashPassword(password)) return res.status(401).json({ error: "Invalid credentials" });
    res.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch { res.status(500).json({ error: "Internal server error" }); }
});

export default router;
