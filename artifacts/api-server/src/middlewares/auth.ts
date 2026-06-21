import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string; role: string };
}

function getSessionUser(req: Request): { id: number; email: string; role: string } | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.slice(7);
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parsed = JSON.parse(decoded);
    if (parsed && parsed.id && parsed.email && parsed.role) return parsed;
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
