import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string; role: string };
}

const JWT_SECRET = process.env.SESSION_SECRET || process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("SESSION_SECRET or JWT_SECRET environment variable must be set");
}

export function signToken(payload: { id: number; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: "7d" });
}

function getSessionUser(req: Request): { id: number; email: string; role: string } | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET as string) as { id: number; email: string; role: string };
    if (decoded && decoded.id && decoded.email && decoded.role) return decoded;
  } catch {}
  return null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const user = getSessionUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  (req as AuthenticatedRequest).user = user;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const user = getSessionUser(req);
  if (!user) { res.status(401).json({ error: "Unauthorized" }); return; }
  if (user.role !== "admin") { res.status(403).json({ error: "Forbidden" }); return; }
  (req as AuthenticatedRequest).user = user;
  next();
}
