# Phase 2: API Server Refactoring - Quick Start Guide

**Status**: Ready to Start  
**Branch**: `refactor/restructure-architecture`  
**Estimated Duration**: 2-3 days (8-12 hours)  

---

## 📋 Overview

Phase 2 transforms the API server from **route-based** to **feature-based** architecture with a clear **Service → Controller → Router** pattern.

### Current State (To Replace)
```typescript
// artifacts/api-server/src/routes/products.ts
router.get("/products", async (req, res) => {
  // Mixed concerns: validation, DB query, response formatting
  const products = await db.select().from(productsTable);
  res.json(products);
});
```

### Target State (Feature-Based)
```
artifacts/api-server/src/features/packages/
├── service.ts       → Business logic (reusable)
├── controller.ts    → HTTP request/response handling
├── router.ts        → Route definitions
├── types.ts         → Feature-specific types
├── validators.ts    → Request validation
└── tests/          → Feature tests
```

---

## 🎯 Step-by-Step Implementation

### Step 2.1: Create PackageService

**File**: `artifacts/api-server/src/features/packages/service.ts`

```typescript
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq, lte, ilike, and } from "drizzle-orm";

export interface PackageFilters {
  sort?: string;
  price?: number;
  category?: string;
  inStock?: boolean;
}

export class PackageService {
  /**
   * Get all packages with optional filters
   */
  async getAllPackages(filters?: PackageFilters) {
    const conditions = [];
    
    if (filters?.price) {
      conditions.push(lte(productsTable.price, filters.price));
    }
    if (filters?.category) {
      conditions.push(eq(productsTable.category, filters.category));
    }
    if (filters?.inStock !== undefined) {
      conditions.push(eq(productsTable.inStock, filters.inStock ? 1 : 0));
    }

    let query = db.select().from(productsTable);
    if (conditions.length) {
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
    return product;
  }

  /**
   * Get package by slug
   */
  async getPackageBySlug(slug: string) {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.slug, slug));
    return product;
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
    return updated;
  }

  /**
   * Delete package
   */
  async deletePackage(id: number) {
    await db.delete(productsTable).where(eq(productsTable.id, id));
  }

  /**
   * Helper: Sort packages
   */
  private sortPackages(products: any[], sort?: string) {
    const sorted = [...products];
    if (sort === "titleAsc") {
      sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sort === "titleDesc") {
      sorted.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    } else if (sort === "lowPrice") {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "highPrice") {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    return sorted;
  }
}
```

### Step 2.2: Create PackageController

**File**: `artifacts/api-server/src/features/packages/controller.ts`

```typescript
import { Request, Response } from "express";
import { PackageService, PackageFilters } from "./service";

export class PackageController {
  constructor(private service: PackageService) {}

  /**
   * GET /api/packages
   * List all packages with optional filters
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const filters: PackageFilters = {
        sort: req.query.sort as string | undefined,
        price: req.query.price ? Number(req.query.price) : undefined,
        category: req.query.category as string | undefined,
        inStock: req.query.inStock === "true",
      };

      const packages = await this.service.getAllPackages(filters);
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  }

  /**
   * GET /api/packages/:id
   * Get package by ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const pkg = await this.service.getPackageById(id);

      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }

      res.json(pkg);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch package" });
    }
  }

  /**
   * GET /api/packages/slug/:slug
   * Get package by slug
   */
  async getBySlug(req: Request, res: Response): Promise<void> {
    try {
      const slug = Array.isArray(req.params.slug) 
        ? req.params.slug[0] 
        : req.params.slug;
      
      const pkg = await this.service.getPackageBySlug(slug);

      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }

      res.json(pkg);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch package" });
    }
  }

  /**
   * POST /api/packages
   * Create new package (admin only)
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const pkg = await this.service.createPackage(req.body);
      res.status(201).json(pkg);
    } catch (error) {
      res.status(400).json({ error: "Failed to create package" });
    }
  }

  /**
   * PUT /api/packages/:id
   * Update package (admin only)
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const pkg = await this.service.updatePackage(id, req.body);

      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }

      res.json(pkg);
    } catch (error) {
      res.status(400).json({ error: "Failed to update package" });
    }
  }

  /**
   * DELETE /api/packages/:id
   * Delete package (admin only)
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.service.deletePackage(id);
      res.json({ message: "Package deleted" });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete package" });
    }
  }
}
```

### Step 2.3: Create PackageRouter

**File**: `artifacts/api-server/src/features/packages/router.ts`

```typescript
import { Router, type Request, type Response, type NextFunction } from "express";
import { PackageService } from "./service";
import { PackageController } from "./controller";
import { requireAdmin } from "../../middlewares/auth";

/**
 * Create packages router with service and controller
 */
export function createPackagesRouter() {
  const router = Router();
  const service = new PackageService();
  const controller = new PackageController(service);

  // Public routes
  router.get("/", (req, res) => controller.list(req, res));
  router.get("/slug/:slug", (req, res) => controller.getBySlug(req, res));
  router.get("/:id", (req, res) => controller.getById(req, res));

  // Admin routes
  router.post("/", requireAdmin, (req, res) => controller.create(req, res));
  router.put("/:id", requireAdmin, (req, res) => controller.update(req, res));
  router.delete("/:id", requireAdmin, (req, res) => controller.delete(req, res));

  return router;
}
```

### Step 2.4: Create Feature Types (Optional)

**File**: `artifacts/api-server/src/features/packages/types.ts`

```typescript
import { Product, Category } from "@workspace/db";

export interface PackageDetail extends Product {
  category?: Category;
  menuItems?: MenuItem[];
  additionalServices?: AdditionalService[];
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  pricePerPerson: number;
}

export interface AdditionalService {
  id: number;
  name: string;
  price: number;
  priceType: string;
}
```

### Step 2.5: Update app.ts

**File**: `artifacts/api-server/src/app.ts`

Replace existing route setup with feature-based routers:

```typescript
import { createPackagesRouter } from "./features/packages/router";
import { createQuotationsRouter } from "./features/quotations/router";
import { createMenuItemsRouter } from "./features/menu-items/router";
import { createAdditionalServicesRouter } from "./features/additional-services/router";
import { createEventTypesRouter } from "./features/event-types/router";
import { createUsersRouter } from "./features/users/router";
import { createNotificationsRouter } from "./features/notifications/router";

export function setupRoutes(app: Express) {
  // Feature routes
  app.use("/api/packages", createPackagesRouter());
  app.use("/api/quotations", createQuotationsRouter());
  app.use("/api/menu-items", createMenuItemsRouter());
  app.use("/api/additional-services", createAdditionalServicesRouter());
  app.use("/api/categories", createEventTypesRouter()); // Event types
  app.use("/api/users", createUsersRouter());
  app.use("/api/notifications", createNotificationsRouter());

  // Health check
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
}
```

---

## 📝 Checklist for Phase 2

### For Each Feature (packages, quotations, menu-items, additional-services, event-types, users, notifications)

- [ ] Create `service.ts` with business logic
- [ ] Create `controller.ts` with HTTP handling
- [ ] Create `router.ts` with route setup
- [ ] Create `types.ts` with feature types (optional)
- [ ] Move current route handlers from `routes/` to new structure
- [ ] Test all endpoints
- [ ] Update import statements in `app.ts`

### Feature-Specific Tasks

**Packages** (from `routes/products.ts`):
- [ ] Move to `features/packages/`
- [ ] Extract business logic to service
- [ ] Create controller with list, getById, getBySlug, create, update, delete

**Quotations** (from `routes/orders.ts`):
- [ ] Move to `features/quotations/`
- [ ] Extract business logic to service
- [ ] Create controller

**Menu Items** (from `routes/menuItems.ts`):
- [ ] Move to `features/menu-items/`
- [ ] Extract business logic to service
- [ ] Create controller

**Additional Services** (from `routes/additionalServices.ts`):
- [ ] Move to `features/additional-services/`
- [ ] Extract business logic to service
- [ ] Create controller

**Event Types** (from `routes/categories.ts`):
- [ ] Move to `features/event-types/`
- [ ] Extract business logic to service
- [ ] Create controller

**Users** (from `routes/users.ts`):
- [ ] Move to `features/users/`
- [ ] Extract business logic to service
- [ ] Create auth-service.ts separately
- [ ] Create controller

**Notifications** (new feature):
- [ ] Create service for sending notifications
- [ ] Create event handlers for quotation events
- [ ] No router needed (internal service)

### Testing

After completing each feature:
```bash
# Test API endpoint
curl http://localhost:3000/api/packages

# Run TypeScript compilation
pnpm run typecheck

# Build API server
pnpm -w -r --filter @workspace/api-server run build
```

---

## 🚀 How to Start

1. **Open the project** in VS Code
2. **Open** `artifacts/api-server/src/routes/products.ts`
3. **Create** `artifacts/api-server/src/features/packages/service.ts`
4. **Extract** business logic from products.ts into service.ts
5. **Create** `artifacts/api-server/src/features/packages/controller.ts`
6. **Create** `artifacts/api-server/src/features/packages/router.ts`
7. **Test** the endpoint works
8. **Repeat** for each feature

---

## 💡 Key Points

- **Service** = Business logic (reusable, testable)
- **Controller** = HTTP concerns (validation, response formatting)
- **Router** = Route definitions (endpoint paths and methods)
- **Keep separated** = Makes features modular and replaceable

---

## 📌 Next Phase After Phase 2

Once API server is refactored, proceed to **Phase 3: Frontend Shop Refactoring** which will:
- Organize components by feature
- Move pages to feature folders
- Reorganize hooks, stores, and utilities
- Update all import paths

