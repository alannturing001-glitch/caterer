# Phase 3: Frontend Refactoring & Validation - Quick Start Guide

**Status**: Ready to Start  
**Branch**: `refactor/restructure-architecture` (continue)  
**Estimated Duration**: 2-3 days (8-12 hours)  

---

## 📋 Overview

Phase 3 will refactor the **React frontend** from a flat, mixed-concerns component structure to the same **feature-based architecture** established in Phase 2. This follows the same Service → Hook → Component pattern used in React development.

### Current State (To Replace)
```
artifacts/shop/src/
├── components/          (40+ flat files, mixed concerns)
├── pages/               (scattered page structure)
├── lib/                 (13 utility files, unsorted)
├── store/               (5 stores scattered)
└── hooks/               (7 hooks scattered)
```

### Target State (Feature-Based)
```
artifacts/shop/src/
├── features/
│   ├── packages/        → Self-contained feature
│   ├── quotations/
│   ├── shopping-cart/
│   ├── event-types/
│   ├── wishlist/
│   ├── auth/
│   ├── notifications/
│   └── admin/           → Admin sub-features
│
└── shared/              → Global components & utilities
    ├── components/
    ├── hooks/
    ├── lib/
    └── store/
```

---

## 🎯 Phase 3 Implementation Plan

### Step 3.1: Validate API Server Changes

**Objective**: Ensure Phase 2 refactored API server compiles and works correctly

**Tasks**:
```bash
# 1. Run TypeScript compilation
cd artifacts/api-server
npm run build

# 2. Start the API server
npm run dev

# 3. Test endpoints manually
curl http://localhost:3000/api/packages
curl http://localhost:3000/api/event-types
curl http://localhost:3000/api/auth/login -X POST
```

**Expected Outcome**:
- ✅ TypeScript compilation succeeds
- ✅ API server starts without errors
- ✅ All endpoints respond correctly
- ✅ No import errors

---

### Step 3.2: Refactor Frontend Features (Similar to Backend)

#### 3.2.1: Packages Feature

**Location**: `artifacts/shop/src/features/packages/`

**Structure**:
```
packages/
├── components/
│   ├── PackageCard.tsx        (display package)
│   ├── PackageList.tsx        (list view)
│   ├── PackageDetail.tsx      (detail page)
│   └── PackageFilter.tsx      (filter panel)
│
├── pages/
│   ├── PackagesPage.tsx       (main page)
│   └── PackageDetailPage.tsx  (detail page)
│
├── hooks/
│   ├── usePackages.ts         (fetch packages)
│   ├── usePackageDetail.ts    (fetch single package)
│   └── usePackageFilters.ts   (manage filters)
│
├── store/
│   └── packageStore.ts        (Zustand/Pinia store)
│
├── api/
│   └── packagesApi.ts         (API calls)
│
├── types/
│   └── index.ts               (TypeScript types)
│
└── index.ts                   (export file)
```

**Files to Create/Refactor**:
1. `hooks/usePackages.ts` - Fetch and filter packages
2. `hooks/usePackageDetail.ts` - Fetch single package
3. `hooks/usePackageFilters.ts` - Manage filter state
4. `store/packageStore.ts` - Global state management
5. `api/packagesApi.ts` - API client wrapper
6. `types/index.ts` - TypeScript types
7. Move components to `components/`
8. Move pages to `pages/`

**Example Hook**:
```typescript
// artifacts/shop/src/features/packages/hooks/usePackages.ts
import { useState, useEffect } from 'react';
import { PackageItem } from '../types';
import { fetchPackages } from '../api/packagesApi';

export function usePackages(filters?: PackageFilters) {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchPackages(filters);
        setPackages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [filters]);

  return { packages, loading, error };
}
```

#### 3.2.2: Other Frontend Features

Repeat the same pattern for:

1. **Quotations** (`features/quotations/`)
   - Components: QuotationForm, QuotationsList, QuotationDetail
   - Hooks: useQuotations, useQuotationForm
   - API: quotationsApi.ts

2. **Shopping Cart** (`features/shopping-cart/`)
   - Components: CartItem, CartSummary, CartCheckout
   - Hooks: useCart, useCheckout
   - Store: cartStore.ts

3. **Event Types** (`features/event-types/`)
   - Components: EventTypeSelector, EventTypeList
   - Hooks: useEventTypes
   - API: eventTypesApi.ts

4. **Wishlist** (`features/wishlist/`)
   - Components: WishlistItem, WishlistList
   - Hooks: useWishlist
   - Store: wishlistStore.ts

5. **Auth** (`features/auth/`)
   - Components: LoginForm, RegisterForm, AuthGuard
   - Hooks: useAuth, useLogin, useRegister
   - Store: authStore.ts
   - API: authApi.ts

6. **Notifications** (`features/notifications/`)
   - Components: NotificationCenter, NotificationItem
   - Hooks: useNotifications
   - Store: notificationStore.ts

7. **Admin** (`features/admin/`)
   - PackagesAdmin, QuotationsAdmin, UsersAdmin, etc.

---

### Step 3.3: Add Request Validation & Error Handling

**Objective**: Implement Zod validation and centralized error handling

#### 3.3.1: Backend Validation

**Create**: `artifacts/api-server/src/features/[feature]/validators.ts`

```typescript
// artifacts/api-server/src/features/packages/validators.ts
import { z } from 'zod';

export const CreatePackageSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string().min(1),
  slug: z.string().min(1).max(255),
  inStock: z.number().min(0).max(1).optional(),
});

export const UpdatePackageSchema = CreatePackageSchema.partial();

export type CreatePackage = z.infer<typeof CreatePackageSchema>;
```

**Update Controllers** to validate input:
```typescript
async create(req: Request, res: Response): Promise<void> {
  try {
    const validated = CreatePackageSchema.parse(req.body);
    const pkg = await this.service.createPackage(validated);
    res.status(201).json(pkg);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(400).json({ error: 'Failed to create package' });
    }
  }
}
```

#### 3.3.2: Centralized Error Handling

**Create**: `artifacts/api-server/src/shared/middleware/errorHandler.ts`

```typescript
import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

---

### Step 3.4: Add Unit & Integration Tests

**Objective**: Create comprehensive test suite for Phase 2 refactored API

#### 3.4.1: Service Tests

**Create**: `artifacts/api-server/src/features/packages/tests/service.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { PackageService } from '../service';
import { db } from '@workspace/db';

describe('PackageService', () => {
  let service: PackageService;

  beforeEach(() => {
    service = new PackageService();
  });

  describe('getAllPackages', () => {
    it('should return all packages', async () => {
      const packages = await service.getAllPackages();
      expect(Array.isArray(packages)).toBe(true);
    });

    it('should filter by price', async () => {
      const packages = await service.getAllPackages({ price: 100 });
      expect(packages.every(p => p.price <= 100)).toBe(true);
    });
  });

  describe('getPackageById', () => {
    it('should return package by ID', async () => {
      const pkg = await service.getPackageById(1);
      expect(pkg).toBeDefined();
      expect(pkg?.id).toBe(1);
    });

    it('should return null for non-existent ID', async () => {
      const pkg = await service.getPackageById(999999);
      expect(pkg).toBeNull();
    });
  });
});
```

#### 3.4.2: Controller Tests

**Create**: `artifacts/api-server/src/features/packages/tests/controller.test.ts`

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PackageController } from '../controller';
import { PackageService } from '../service';
import { Request, Response } from 'express';

describe('PackageController', () => {
  let controller: PackageController;
  let mockService: PackageService;

  beforeEach(() => {
    mockService = {
      getAllPackages: vi.fn(),
    } as any;
    controller = new PackageController(mockService);
  });

  describe('list', () => {
    it('should return list of packages', async () => {
      const mockPackages = [{ id: 1, title: 'Package 1' }];
      mockService.getAllPackages.mockResolvedValue(mockPackages);

      const req = {} as Request;
      const res = {
        json: vi.fn(),
      } as any as Response;

      await controller.list(req, res);

      expect(res.json).toHaveBeenCalledWith(mockPackages);
    });
  });
});
```

---

### Step 3.5: Integration Tests

**Create**: `artifacts/api-server/src/features/packages/tests/integration.test.ts`

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../../app';

describe('Packages Endpoints', () => {
  describe('GET /api/packages', () => {
    it('should return list of packages', async () => {
      const response = await request(app).get('/api/packages');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/packages/:id', () => {
    it('should return package by ID', async () => {
      const response = await request(app).get('/api/packages/1');
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
    });

    it('should return 404 for non-existent package', async () => {
      const response = await request(app).get('/api/packages/999999');
      expect(response.status).toBe(404);
    });
  });
});
```

---

### Step 3.6: Create Frontend API Client

**Create**: `artifacts/shop/src/shared/lib/apiClient.ts`

```typescript
import { useAuthStore } from '@features/auth';

const API_BASE = process.env.VITE_API_URL || 'http://localhost:3000/api';

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const authStore = useAuthStore();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };

  if (authStore.token) {
    headers['Authorization'] = `Bearer ${authStore.token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

export function createApiClient<T>(endpoint: string) {
  return {
    list: () => apiRequest<T[]>(endpoint),
    get: (id: number) => apiRequest<T>(`${endpoint}/${id}`),
    create: (data: Partial<T>) =>
      apiRequest<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<T>) =>
      apiRequest<T>(`${endpoint}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      apiRequest<void>(`${endpoint}/${id}`, {
        method: 'DELETE',
      }),
  };
}
```

---

## 📊 Phase 3 Checklist

### Validation
- [ ] API Server TypeScript compilation passes
- [ ] All API endpoints tested and working
- [ ] No import/export errors

### Frontend Refactoring
- [ ] Packages feature refactored
- [ ] Quotations feature refactored
- [ ] Shopping-cart feature refactored
- [ ] Event-types feature refactored
- [ ] Wishlist feature refactored
- [ ] Auth feature refactored
- [ ] Notifications feature refactored
- [ ] Admin features refactored

### Error Handling & Validation
- [ ] Zod validators created for all features
- [ ] Centralized error handler middleware added
- [ ] Frontend error boundaries implemented
- [ ] API client error handling

### Testing
- [ ] Unit tests for all services (backend)
- [ ] Unit tests for all controllers (backend)
- [ ] Integration tests for API endpoints
- [ ] Component tests for key frontend components
- [ ] All tests passing

### Documentation & Cleanup
- [ ] Update API documentation
- [ ] Archive/delete old route files
- [ ] Create migration guide for developers
- [ ] Update README with new architecture

---

## 🚀 Commands Reference

```bash
# API Server
cd artifacts/api-server

# Build & run TypeScript check
npm run build
npm run typecheck

# Start dev server
npm run dev

# Run tests
npm run test
npm run test:coverage

# Frontend
cd artifacts/shop

# Start Vite dev server
npm run dev

# Build for production
npm run build

# Run component tests
npm run test

# Type checking
npm run typecheck
```

---

## 📝 Notes for Phase 3

### Key Principles
1. **Consistency** - Follow the same pattern across all features
2. **Co-location** - Keep feature files together
3. **Type Safety** - Use TypeScript for all code
4. **Testing** - Test at all levels (unit, integration, component)
5. **Documentation** - Document complex logic and APIs

### Common Pitfalls to Avoid
- ❌ Don't mix concerns across layers
- ❌ Don't create circular dependencies
- ❌ Don't forget error handling
- ❌ Don't skip testing
- ❌ Don't over-engineer simple features

### Performance Considerations
- Use React.memo for expensive components
- Implement proper caching strategies
- Lazy load features when possible
- Monitor bundle size

---

## Phase 3 Success Criteria

✅ All Phase 2 API changes working correctly  
✅ Frontend features organized by feature, not component type  
✅ 80%+ test coverage for critical features  
✅ No console errors or warnings  
✅ TypeScript compilation succeeds  
✅ All endpoints tested and documented  
✅ Clear architecture for new developers to follow  

---

**Phase 3 is ready to begin!** 🚀

Start with Step 3.1 (API Server validation) and work through systematically. Each feature refactoring builds on the previous one.

For any issues, refer back to Phase 2 patterns and maintain consistency across the codebase.
