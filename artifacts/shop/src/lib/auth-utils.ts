'use server';

import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession();
  return (session as any)?.user?.role === "admin";
}

/**
 * Require admin access, throw error if not admin
 */
export async function requireAdmin() {
  const session = await getServerSession();
  
  if (!session) {
    throw new Error("Authentication required");
  }
  
  if ((session as any)?.user?.role !== "admin") {
    throw new Error("Admin access required");
  }
  
  return session;
}

/**
 * Check if current user is a caterer
 */
export async function isCaterer(): Promise<boolean> {
  const session = await getServerSession();
  return (session as any)?.user?.role === "caterer";
}

/**
 * Require caterer access
 */
export async function requireCaterer() {
  const session = await getServerSession();
  
  if (!session) {
    throw new Error("Authentication required");
  }
  
  if ((session as any)?.user?.role !== "caterer") {
    throw new Error("Caterer access required");
  }
  
  return session;
}

/**
 * Check if current user is a customer
 */
export async function isCustomer(): Promise<boolean> {
  const session = await getServerSession();
  return (session as any)?.user?.role === "customer";
}

/**
 * Require customer access
 */
export async function requireCustomer() {
  const session = await getServerSession();
  
  if (!session) {
    throw new Error("Authentication required");
  }
  
  if ((session as any)?.user?.role !== "customer") {
    throw new Error("Customer access required");
  }
  
  return session;
}

/**
 * Get current user session
 */
export async function getCurrentSession() {
  return await getServerSession();
}

/**
 * Get current user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession();
  return (session as any)?.user?.id || null;
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const session = await getServerSession();
  return (session as any)?.user || null;
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
