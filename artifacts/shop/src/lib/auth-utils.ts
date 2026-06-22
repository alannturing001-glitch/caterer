import { getStoredToken } from "@/hooks/useAuth";

function getTokenPayload() {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  return getTokenPayload()?.role === 'admin';
}

export async function requireAdmin() {
  const payload = getTokenPayload();
  if (!payload) throw new Error("Authentication required");
  if (payload.role !== 'admin') throw new Error("Admin access required");
  return payload;
}

export async function isCaterer(): Promise<boolean> {
  return getTokenPayload()?.role === 'caterer';
}

export async function requireCaterer() {
  const payload = getTokenPayload();
  if (!payload) throw new Error("Authentication required");
  if (payload.role !== 'caterer') throw new Error("Caterer access required");
  return payload;
}

export async function isCustomer(): Promise<boolean> {
  return getTokenPayload()?.role === 'customer';
}

export async function requireCustomer() {
  const payload = getTokenPayload();
  if (!payload) throw new Error("Authentication required");
  if (payload.role !== 'customer') throw new Error("Customer access required");
  return payload;
}

export async function getCurrentSession() {
  return getTokenPayload();
}

export async function getCurrentUserId(): Promise<string | null> {
  return getTokenPayload()?.id || null;
}

export async function getCurrentUser() {
  return getTokenPayload() || null;
}

export default {
  isAdmin,
  requireAdmin,
  isCaterer,
  requireCaterer,
  isCustomer,
  requireCustomer,
  getCurrentSession,
  getCurrentUserId,
  getCurrentUser,
};
