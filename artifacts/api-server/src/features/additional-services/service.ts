import { db } from "@workspace/db";
import { additionalServicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export interface AdditionalService {
  id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * AdditionalServiceService handles all business logic for additional services
 */
export class AdditionalServiceService {
  /**
   * Get all additional services
   */
  async getAllServices(): Promise<AdditionalService[]> {
    const services = await db.select().from(additionalServicesTable);
    return services;
  }

  /**
   * Get service by ID
   */
  async getServiceById(id: number): Promise<AdditionalService | null> {
    const [service] = await db
      .select()
      .from(additionalServicesTable)
      .where(eq(additionalServicesTable.id, id));
    return service || null;
  }

  /**
   * Create new service
   */
  async createService(data: Partial<AdditionalService>): Promise<AdditionalService> {
    const [created] = await db
      .insert(additionalServicesTable)
      .values(data as any)
      .returning();
    return created;
  }

  /**
   * Update service
   */
  async updateService(
    id: number,
    data: Partial<AdditionalService>
  ): Promise<AdditionalService | null> {
    const [updated] = await db
      .update(additionalServicesTable)
      .set(data as any)
      .where(eq(additionalServicesTable.id, id))
      .returning();
    return updated || null;
  }

  /**
   * Delete service
   */
  async deleteService(id: number): Promise<boolean> {
    await db
      .delete(additionalServicesTable)
      .where(eq(additionalServicesTable.id, id));
    return true;
  }
}
