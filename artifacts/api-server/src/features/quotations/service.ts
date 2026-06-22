import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

export interface Quotation {
  id: number;
  userId?: number;
  packageId?: number;
  eventDate?: string;
  guestCount?: number;
  specialRequests?: string;
  totalPrice?: number;
  status?: "pending" | "approved" | "rejected" | "completed";
  createdAt?: string;
  updatedAt?: string;
}

/**
 * QuotationService handles all business logic for quotations/orders
 */
export class QuotationService {
  /**
   * Get all quotations (admin only)
   */
  async getAllQuotations(): Promise<Quotation[]> {
    const quotations = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt));
    return quotations;
  }

  /**
   * Get quotation by ID
   */
  async getQuotationById(id: number): Promise<Quotation | null> {
    const [quotation] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id));
    return quotation || null;
  }

  /**
   * Get quotations by user ID
   */
  async getQuotationsByUserId(userId: number): Promise<Quotation[]> {
    const quotations = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.userId, userId))
      .orderBy(desc(ordersTable.createdAt));
    return quotations;
  }

  /**
   * Create new quotation
   */
  async createQuotation(data: Partial<Quotation>): Promise<Quotation> {
    const [created] = await db
      .insert(ordersTable)
      .values(data as any)
      .returning();
    return created;
  }

  /**
   * Update quotation
   */
  async updateQuotation(
    id: number,
    data: Partial<Quotation>
  ): Promise<Quotation | null> {
    const [updated] = await db
      .update(ordersTable)
      .set(data as any)
      .where(eq(ordersTable.id, id))
      .returning();
    return updated || null;
  }

  /**
   * Update quotation status
   */
  async updateQuotationStatus(
    id: number,
    status: "pending" | "approved" | "rejected" | "completed"
  ): Promise<Quotation | null> {
    const [updated] = await db
      .update(ordersTable)
      .set({ status })
      .where(eq(ordersTable.id, id))
      .returning();
    return updated || null;
  }

  /**
   * Delete quotation
   */
  async deleteQuotation(id: number): Promise<boolean> {
    await db.delete(ordersTable).where(eq(ordersTable.id, id));
    return true;
  }

  /**
   * Get quotations count
   */
  async getQuotationsCount(): Promise<number> {
    const result = await db
      .select()
      .from(ordersTable);
    return result.length;
  }
}
