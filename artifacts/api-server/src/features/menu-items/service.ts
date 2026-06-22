import { db } from "@workspace/db";
import { menuItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  packageId: number;
  category?: string;
  price?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * MenuItemService handles all business logic for menu items
 */
export class MenuItemService {
  /**
   * Get all menu items with optional package filter
   */
  async getAllMenuItems(packageId?: number): Promise<MenuItem[]> {
    let query = db.select().from(menuItemsTable);
    if (packageId) {
      query = (query as any).where(eq(menuItemsTable.packageId, packageId));
    }
    return await query;
  }

  /**
   * Get menu item by ID
   */
  async getMenuItemById(id: number): Promise<MenuItem | null> {
    const [item] = await db
      .select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.id, id));
    return item || null;
  }

  /**
   * Get all menu items for a package
   */
  async getMenuItemsByPackageId(packageId: number): Promise<MenuItem[]> {
    return await db
      .select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.packageId, packageId));
  }

  /**
   * Create new menu item
   */
  async createMenuItem(data: Partial<MenuItem>): Promise<MenuItem> {
    const [created] = await db
      .insert(menuItemsTable)
      .values(data as any)
      .returning();
    return created;
  }

  /**
   * Update menu item
   */
  async updateMenuItem(
    id: number,
    data: Partial<MenuItem>
  ): Promise<MenuItem | null> {
    const [updated] = await db
      .update(menuItemsTable)
      .set(data as any)
      .where(eq(menuItemsTable.id, id))
      .returning();
    return updated || null;
  }

  /**
   * Delete menu item
   */
  async deleteMenuItem(id: number): Promise<boolean> {
    await db.delete(menuItemsTable).where(eq(menuItemsTable.id, id));
    return true;
  }

  /**
   * Delete all menu items for a package
   */
  async deleteMenuItemsByPackageId(packageId: number): Promise<boolean> {
    await db
      .delete(menuItemsTable)
      .where(eq(menuItemsTable.packageId, packageId));
    return true;
  }
}
