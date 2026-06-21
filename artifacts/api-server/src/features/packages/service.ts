import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq, lte, ilike, and } from "drizzle-orm";

export interface PackageFilters {
  sort?: string;
  price?: number;
  category?: string;
  inStock?: boolean;
  outOfStock?: boolean;
}

/**
 * PackageService handles all business logic for catering packages
 * This separates concerns from HTTP routing and request handling
 */
export class PackageService {
  /**
   * Get all packages with optional filters and pagination
   */
  async getAllPackages(filters?: PackageFilters) {
    const conditions = [];

    if (filters?.price) {
      conditions.push(lte(productsTable.price, filters.price));
    }

    if (filters?.category) {
      conditions.push(eq(productsTable.category, filters.category));
    }

    // Handle stock filtering
    const inStockBool = filters?.inStock === true;
    const outOfStockBool = filters?.outOfStock === true;
    if (inStockBool && !outOfStockBool) {
      conditions.push(eq(productsTable.inStock, 1));
    } else if (!inStockBool && outOfStockBool) {
      conditions.push(eq(productsTable.inStock, 0));
    }

    let query = db.select().from(productsTable);
    if (conditions.length > 0) {
      query = (query as any).where(and(...conditions));
    }

    const products = await query;
    return this.sortPackages(products, filters?.sort);
  }

  /**
   * Get single package by ID
   */
  async getPackageById(id: number) {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));
    return product || null;
  }

  /**
   * Get package by slug
   */
  async getPackageBySlug(slug: string) {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, slug));
    return product || null;
  }

  /**
   * Search packages by title
   */
  async searchPackages(term: string) {
    const packages = await db
      .select()
      .from(productsTable)
      .where(ilike(productsTable.title, `%${term}%`));
    return packages;
  }

  /**
   * Create new package
   */
  async createPackage(data: any) {
    const [created] = await db.insert(productsTable).values(data).returning();
    return created;
  }

  /**
   * Update existing package
   */
  async updatePackage(id: number, data: any) {
    const [updated] = await db
      .update(productsTable)
      .set(data)
      .where(eq(productsTable.id, id))
      .returning();
    return updated || null;
  }

  /**
   * Delete package
   */
  async deletePackage(id: number): Promise<boolean> {
    const result = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id));
    return true;
  }

  /**
   * Helper: Sort packages by various criteria
   */
  private sortPackages(products: any[], sort?: string) {
    const sorted = [...products];

    switch (sort) {
      case "titleAsc":
        sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "titleDesc":
        sorted.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
      case "lowPrice":
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "highPrice":
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
    }

    return sorted;
  }
}
