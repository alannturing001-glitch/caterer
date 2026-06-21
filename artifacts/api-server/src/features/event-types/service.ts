import { db } from "@workspace/db";
import { categoriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export interface EventType {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * EventTypeService handles all business logic for event types/categories
 */
export class EventTypeService {
  /**
   * Get all event types
   */
  async getAllEventTypes(): Promise<EventType[]> {
    const categories = await db.select().from(categoriesTable);
    return categories;
  }

  /**
   * Get event type by ID
   */
  async getEventTypeById(id: number): Promise<EventType | null> {
    const [category] = await db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, id));
    return category || null;
  }

  /**
   * Create new event type
   */
  async createEventType(name: string, icon?: string): Promise<EventType> {
    const slug = this.generateSlug(name);
    const [created] = await db
      .insert(categoriesTable)
      .values({
        name,
        slug,
        icon: icon || "🍽️",
      })
      .returning();
    return created;
  }

  /**
   * Update event type
   */
  async updateEventType(
    id: number,
    updates: Partial<EventType>
  ): Promise<EventType | null> {
    const updateData: any = {};
    if (updates.name) {
      updateData.name = updates.name;
      updateData.slug = this.generateSlug(updates.name);
    }
    if (updates.icon) {
      updateData.icon = updates.icon;
    }

    const [updated] = await db
      .update(categoriesTable)
      .set(updateData)
      .where(eq(categoriesTable.id, id))
      .returning();
    return updated || null;
  }

  /**
   * Delete event type
   */
  async deleteEventType(id: number): Promise<boolean> {
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
    return true;
  }

  /**
   * Helper: Generate slug from name
   */
  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, "-");
  }
}
