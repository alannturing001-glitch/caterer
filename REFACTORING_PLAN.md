# CaterMarket Codebase Refactoring & Restructuring Analysis

**Date**: June 21, 2026  
**Project**: CaterMarket - Catering Marketplace  
**Current Status**: ~70% complete  
**Scope**: Full-stack monorepo refactoring  

---

## EXECUTIVE SUMMARY

The CaterMarket codebase has grown organically and now shows signs of maintenance friction. While the core features are well-implemented, the **file organization lacks clear structure**, making it difficult for new developers to:

- Find files related to specific features
- Understand the architectural boundaries
- Identify which files depend on which
- Extend functionality without breaking existing code

This document provides a **comprehensive refactoring plan** to reorganize the codebase into a **feature-first, scalable architecture** that follows modern software engineering best practices.

---

## PART 1: PROBLEMS WITH CURRENT STRUCTURE

### 1.1 **Components Folder Chaos** (40+ files, flat structure)

**Current**: `artifacts/shop/src/components/`

**Problems**:
- **Flat structure** with no logical grouping — all 40+ components at the same level
- **Mixed concerns**: Page components, reusable UI components, feature-specific components all together
- **Hard to discover**: Finding all "quotation" or "package" related components requires searching
- **Naming ambiguity**: `ProductItem.tsx` vs `PackageItem.tsx` suggests domain confusion
- **Cart logic mixed**: `CartElement.tsx`, `QuantityInput.tsx`, `QuantityInputCart.tsx` scattered
- **Admin components not separated**: Admin components like `DashboardSidebar.tsx`, `AdminGuard.tsx` mixed with public components
- **UI library components mixed**: 40+ shadcn/ui components in `components/ui/` alongside feature components

**Impact**: 
- New features require searching through all components
- Cart feature files are not colocated
- Cart feature files are not colocated
- Admin-specific components are not identified at a glance
- Impossible to understand component hierarchy

---

### 1.2 **Pages Folder Missing Feature Organization** 

**Current**: `artifacts/shop/src/pages/`

**Problems**:
- Admin pages are in `pages/admin/` but there's no feature grouping within pages
- Public pages (`HomePage.tsx`, `ShopPage.tsx`, `ProductPage.tsx`) have no clear organization
- No separation between "feature pages" and "layout pages"
- `CartPage.tsx`, `CheckoutPage.tsx` indicate incomplete shopping feature separation
- Page components often handle multiple responsibilities (routing, state, rendering)

**Impact**:
- Hard to add new features without creating more page-level files
- Page routes mix multiple business domains
- Feature-specific pages are not identifiable

---

### 1.3 **Lib Folder Utilities are Unsorted** (13 files in one folder)

**Current**: `artifacts/shop/src/lib/` - contains 13 utility files:

```
api.ts                  # HTTP client
auth-utils.ts          # Authentication logic
config.ts              # Configuration
constants.ts           # Constants
error-handler.ts       # Error handling
form-sanitize.ts       # Form sanitization
format.ts              # Formatting utilities
notification-api.ts    # Notification API
notification-helpers.ts # Notification helpers
rate-limit.ts          # Rate limiting
sanitize.ts            # XSS sanitization
utils.ts               # General utilities
validation.ts          # Form validation
```

**Problems**:
- **No categorization** — all utilities at the same level
- **Multiple concerns**: API, auth, validation, sanitization, notifications all mixed
- **Unclear dependencies**: Hard to identify which utilities depend on which
- **Hard to maintain**: Adding a new auth utility requires scrolling through 13 files
- **Notification code scattered**: Both `notification-api.ts` and `notification-helpers.ts` exist without clear separation

**Impact**:
- Developers can't quickly understand what utilities are available
- Difficult to refactor or move utilities without breaking imports

---

### 1.4 **API Routes are Flat Without Feature Organization**

**Current**: `artifacts/api-server/src/routes/`

**Problems**:
- All route files at the same level: `products.ts`, `categories.ts`, `orders.ts`, `menuItems.ts`, `additionalServices.ts`, etc.
- **No middleware organization**: Auth middleware is in `middlewares/auth.ts` but not colocated with feature logic
- **No clear separation of concerns**: Product routes and quote routes are separate files but don't show their relationship
- **Querying scattered**: Database queries embedded in route handlers without a service layer
- **No validation layer**: Validation logic mixed with route handling

**Impact**:
- Hard to understand which routes serve which feature
- Business logic is not extractable for reuse (e.g., in notifications, emails)
- Adding a feature requires changes in multiple separate files without clear structure

---

### 1.5 **Store Files Mix Multiple Concerns**

**Current**: `artifacts/shop/src/store/` - 5 separate Zustand stores:

```
cartStore.ts           # Shopping cart state
cateringStore.ts       # Event/quotation state
paginationStore.ts     # Pagination state (UI state)
sortStore.ts           # Sort state (UI state)
wishlistStore.ts       # Wishlist state
```

**Problems**:
- **No clear organization** — stores are flat with no logical grouping
- **Unclear responsibility**: `paginationStore` and `sortStore` are UI state, but `cateringStore` is domain state
- **No feature-based grouping**: All stores at the same level despite serving different features
- **Hard to discover**: Which store manages which feature? Not clear.
- **No separation of concerns**: UI state (pagination, sort) mixed with domain state (cart, catering)

**Impact**:
- Developers must know all stores exist before they can use them
- Hard to add new domain state without knowing where to put it

---

### 1.6 **Hooks Folder Has No Feature Organization**

**Current**: `artifacts/shop/src/hooks/` - 7 hooks scattered:

```
use-mobile.tsx          # UI hook (mobile detection)
use-toast.ts            # UI hook (notifications)
useAuth.ts              # Auth hook
useBookings.ts          # Bookings hook
useNotifications.ts     # Notifications hook
useQuotations.ts        # Quotations hook
useSessionTimeout.ts    # Session hook
```

**Problems**:
- **No folder structure**: All 7 hooks at the same level
- **Mixed concerns**: UI hooks (`use-mobile`, `use-toast`) mixed with domain hooks (`useAuth`, `useBookings`)
- **Hard to discover**: Developers won't know which hooks are available without scanning the folder
- **No clear responsibility**: Are these custom hooks? Generic utilities? Feature-specific?

**Impact**:
- New developers can't easily find the hook they need
- Hard to add related hooks without knowing the pattern

---

### 1.7 **Types Scattered Across Multiple Files**

**Current**: 
- `artifacts/shop/src/types/notification.ts` - single types file
- `lib/db/src/schema/index.ts` - database types (Product, Order, Category, etc.)
- Types embedded in component files
- Types embedded in store files
- Types scattered across multiple utility files

**Problems**:
- **No centralized type definitions** — types are everywhere
- **Type duplication**: Same types defined in multiple places (e.g., Product, MenuItem types)
- **No clear ownership**: Unclear which types belong to which feature
- **Hard to maintain**: Changing a type requires searching multiple files
- **Schema types mixed with API types**: Database types and API types are not clearly separated

**Impact**:
- Type changes are risky and error-prone
- Developers must search multiple files to understand the data model
- Duplication leads to inconsistency

---

### 1.8 **API Server: Missing Service Layer**

**Current**: Business logic is embedded in Express route handlers

**Problems**:
- **No abstraction**: Database queries directly in routes
- **No reusability**: Business logic can't be reused in emails, notifications, etc.
- **Hard to test**: Route handlers mix HTTP concerns with business logic
- **No separation of concerns**: Validation, querying, response formatting all mixed together

**Impact**:
- Adding features requires modifying route handlers
- Testing business logic requires mocking HTTP layer
- Duplicated logic across routes

---

### 1.9 **Admin Pages Have No Clear Structure**

**Current**: `artifacts/shop/src/pages/admin/` - 7 files:

```
AdminCategories.tsx     # Event Types management
AdminDashboard.tsx      # Dashboard overview
AdminMerchant.tsx       # Settings (incomplete)
AdminOrders.tsx         # Quotations management
AdminProductForm.tsx    # Package form (incomplete)
AdminProducts.tsx       # Package list (incomplete)
AdminUsers.tsx          # User management
```

**Problems**:
- **No feature-based grouping**: All admin pages at the same level
- **Incomplete forms**: `AdminProductForm.tsx` still shows old electronics fields
- **No clear navigation**: Sidebar needs to show which pages are complete/incomplete
- **Hard to extend**: Adding new admin features requires adding more flat files

**Impact**:
- Admin feature development is not organized
- Hard to see the admin feature map

---

### 1.10 **Missing Feature-Based Architecture**

**Current state**: The codebase is organized by **layer** (components, pages, hooks, stores) rather than by **feature**.

**Current organization**:
```
shop/src/
├── components/          # 40+ component files (flat)
├── pages/               # 7+ page files (minimal grouping)
├── lib/                 # 13 utility files (flat)
├── store/               # 5 store files (flat)
├── hooks/               # 7 hook files (flat)
├── types/               # 1 types file (incomplete)
└── App.tsx
```

**Problems**:
- Developers must understand all layers to work on a single feature
- Files for the same feature are scattered across multiple directories
- Hard to understand feature dependencies
- Adding a new feature requires creating files in 4-5 different locations
- Circular dependencies are hard to identify

**Impact**: 
- **Long onboarding time** for new developers
- **Increased bug risk** when features are scattered
- **Hard to move or remove features** without breaking dependencies

---

## PART 2: CURRENT ARCHITECTURE ANALYSIS

### Technology Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| **Database** | PostgreSQL + Drizzle ORM | ✅ Ready |
| **API Server** | Express.js + Node.js | ✅ Ready |
| **Frontend** | React + Vite | ✅ Ready |
| **State Management** | Zustand | ✅ Ready |
| **UI Components** | shadcn/ui (Radix + Tailwind) | ✅ Ready |
| **Validation** | Zod | ✅ Ready |
| **API Client** | Generated by orval | ✅ Ready |

### Current Feature Map

#### ✅ Implemented Features
1. **Package Management** - Browse catering packages (product API)
2. **Event Types** - Browse event categories with emojis
3. **Quotations** - Submit quotation requests (orders API, but incomplete)
4. **Menu Items** - View package menu items
5. **Additional Services** - View add-on services
6. **Admin Dashboard** - Overview of quotations and packages
7. **Shopping Cart** - Basic cart functionality
8. **Authentication** - Login/logout with JWT

#### 🔲 Incomplete/Missing Features
1. **Quotation Management** - Admin forms, quotation detail views
2. **Package Management** - Admin forms (incomplete)
3. **Menu Item Management** - Full CRUD (API ready, UI missing)
4. **Services Management** - Full CRUD (API ready, UI missing)
5. **Search & Filters** - Partially implemented
6. **Notifications** - Core logic ready, email integration missing
7. **Quotation Tracking** - No customer-facing quotation tracking page
8. **Payment Integration** - Not yet implemented

---

## PART 3: PROPOSED NEW STRUCTURE

### Architecture Principles

The proposed structure follows these key principles:

1. **Feature-First Organization** - Group all files related to a feature together
2. **Layered by Responsibility** - Within each feature, organize by layer (UI, state, API, types)
3. **Clear Separation of Concerns** - Business logic, UI, and infrastructure are clearly separated
4. **Scalability** - Easy to add new features or remove existing ones
5. **Discoverability** - A new developer can find all feature-related files quickly
6. **Testability** - Clear boundaries make unit testing easier
7. **Reusability** - Business logic is separated from UI for reuse

### Proposed File Structure

```
caterer/
├── artifacts/
│   ├── api-server/
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── app.ts
│   │   │   ├── middlewares/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── error-handler.ts
│   │   │   │   ├── logger.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── features/
│   │   │   │   ├── packages/
│   │   │   │   │   ├── router.ts
│   │   │   │   │   ├── service.ts
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── types.ts
│   │   │   │   │   └── tests/
│   │   │   │   │
│   │   │   │   ├── quotations/
│   │   │   │   │   ├── router.ts
│   │   │   │   │   ├── service.ts
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── types.ts
│   │   │   │   │   └── tests/
│   │   │   │   │
│   │   │   │   ├── menu-items/
│   │   │   │   │   ├── router.ts
│   │   │   │   │   ├── service.ts
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── types.ts
│   │   │   │   │   └── tests/
│   │   │   │   │
│   │   │   │   ├── additional-services/
│   │   │   │   │   ├── router.ts
│   │   │   │   │   ├── service.ts
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── types.ts
│   │   │   │   │   └── tests/
│   │   │   │   │
│   │   │   │   ├── event-types/
│   │   │   │   │   ├── router.ts
│   │   │   │   │   ├── service.ts
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── types.ts
│   │   │   │   │   └── tests/
│   │   │   │   │
│   │   │   │   ├── users/
│   │   │   │   │   ├── router.ts
│   │   │   │   │   ├── service.ts
│   │   │   │   │   ├── auth-service.ts
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── types.ts
│   │   │   │   │   └── tests/
│   │   │   │   │
│   │   │   │   └── notifications/
│   │   │   │       ├── service.ts
│   │   │   │       ├── event-handlers.ts
│   │   │   │       ├── types.ts
│   │   │   │       └── tests/
│   │   │   │
│   │   │   └── shared/
│   │   │       ├── types.ts
│   │   │       ├── constants.ts
│   │   │       ├── utils.ts
│   │   │       ├── validators.ts
│   │   │       └── database.ts
│   │   │
│   │   ├── build.mjs
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shop/
│       ├── src/
│       │   ├── App.tsx
│       │   ├── main.tsx
│       │   ├── index.css
│       │   │
│       │   ├── features/
│       │   │   ├── packages/
│       │   │   │   ├── components/
│       │   │   │   │   ├── PackageCard.tsx
│       │   │   │   │   ├── PackageGrid.tsx
│       │   │   │   │   ├── PackageDetail.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── pages/
│       │   │   │   │   ├── PackageBrowsePage.tsx
│       │   │   │   │   └── PackageDetailPage.tsx
│       │   │   │   ├── hooks/
│       │   │   │   │   ├── usePackages.ts
│       │   │   │   │   ├── usePackageFilters.ts
│       │   │   │   │   └── index.ts
│       │   │   │   ├── store/
│       │   │   │   │   ├── packagesStore.ts
│       │   │   │   │   └── index.ts
│       │   │   │   ├── api/
│       │   │   │   │   └── packagesApi.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── index.ts
│       │   │   │   └── index.ts
│       │   │   │
│       │   │   ├── quotations/
│       │   │   │   ├── components/
│       │   │   │   │   ├── QuotationForm.tsx
│       │   │   │   │   ├── QuotationBuilder.tsx
│       │   │   │   │   ├── QuotationSummary.tsx
│       │   │   │   │   ├── QuotationCard.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── pages/
│       │   │   │   │   ├── QuotationRequestPage.tsx
│       │   │   │   │   ├── MyQuotationsPage.tsx
│       │   │   │   │   └── QuotationDetailPage.tsx
│       │   │   │   ├── hooks/
│       │   │   │   │   ├── useQuotationForm.ts
│       │   │   │   │   ├── useQuotations.ts
│       │   │   │   │   └── index.ts
│       │   │   │   ├── store/
│       │   │   │   │   ├── quotationBuilderStore.ts
│       │   │   │   │   └── index.ts
│       │   │   │   ├── api/
│       │   │   │   │   └── quotationsApi.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── index.ts
│       │   │   │   └── index.ts
│       │   │   │
│       │   │   ├── shopping-cart/
│       │   │   │   ├── components/
│       │   │   │   │   ├── CartItem.tsx
│       │   │   │   │   ├── CartSummary.tsx
│       │   │   │   │   ├── CartPage.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── hooks/
│       │   │   │   │   ├── useCart.ts
│       │   │   │   │   └── index.ts
│       │   │   │   ├── store/
│       │   │   │   │   ├── cartStore.ts
│       │   │   │   │   └── index.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── index.ts
│       │   │   │   └── index.ts
│       │   │   │
│       │   │   ├── event-types/
│       │   │   │   ├── components/
│       │   │   │   │   ├── EventTypeGrid.tsx
│       │   │   │   │   ├── EventTypeCard.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useEventTypes.ts
│       │   │   │   ├── api/
│       │   │   │   │   └── eventTypesApi.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── index.ts
│       │   │   │   └── index.ts
│       │   │   │
│       │   │   ├── wishlist/
│       │   │   │   ├── components/
│       │   │   │   │   ├── WishlistPage.tsx
│       │   │   │   │   ├── WishlistItem.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── hooks/
│       │   │   │   │   └── useWishlist.ts
│       │   │   │   ├── store/
│       │   │   │   │   ├── wishlistStore.ts
│       │   │   │   │   └── index.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── index.ts
│       │   │   │   └── index.ts
│       │   │   │
│       │   │   ├── auth/
│       │   │   │   ├── components/
│       │   │   │   │   ├── LoginForm.tsx
│       │   │   │   │   ├── RegisterForm.tsx
│       │   │   │   │   ├── LogoutButton.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   ├── pages/
│       │   │   │   │   ├── LoginPage.tsx
│       │   │   │   │   └── RegisterPage.tsx
│       │   │   │   ├── hooks/
│       │   │   │   │   ├── useAuth.ts
│       │   │   │   │   ├── useSessionTimeout.ts
│       │   │   │   │   └── index.ts
│       │   │   │   ├── api/
│       │   │   │   │   └── authApi.ts
│       │   │   │   ├── types/
│       │   │   │   │   └── index.ts
│       │   │   │   └── index.ts
│       │   │   │
│       │   │   ├── admin/
│       │   │   │   ├── layouts/
│       │   │   │   │   ├── AdminLayout.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   │
│       │   │   │   ├── packages/
│       │   │   │   │   ├── components/
│       │   │   │   │   │   ├── PackageForm.tsx
│       │   │   │   │   │   ├── PackageList.tsx
│       │   │   │   │   │   └── index.ts
│       │   │   │   │   ├── pages/
│       │   │   │   │   │   ├── PackageManagementPage.tsx
│       │   │   │   │   │   └── PackageFormPage.tsx
│       │   │   │   │   ├── hooks/
│       │   │   │   │   │   └── usePackageForm.ts
│       │   │   │   │   └── index.ts
│       │   │   │   │
│       │   │   │   ├── quotations/
│       │   │   │   │   ├── components/
│       │   │   │   │   │   ├── QuotationTable.tsx
│       │   │   │   │   │   ├── QuotationDetail.tsx
│       │   │   │   │   │   ├── StatusBadge.tsx
│       │   │   │   │   │   └── index.ts
│       │   │   │   │   ├── pages/
│       │   │   │   │   │   ├── QuotationManagementPage.tsx
│       │   │   │   │   │   └── QuotationDetailPage.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   │
│       │   │   │   ├── event-types/
│       │   │   │   │   ├── components/
│       │   │   │   │   │   ├── EventTypeForm.tsx
│       │   │   │   │   │   ├── EventTypeList.tsx
│       │   │   │   │   │   └── index.ts
│       │   │   │   │   ├── pages/
│       │   │   │   │   │   └── EventTypeManagementPage.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   │
│       │   │   │   ├── menu-items/
│       │   │   │   │   ├── components/
│       │   │   │   │   │   ├── MenuItemForm.tsx
│       │   │   │   │   │   ├── MenuItemList.tsx
│       │   │   │   │   │   └── index.ts
│       │   │   │   │   ├── pages/
│       │   │   │   │   │   └── MenuItemManagementPage.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   │
│       │   │   │   ├── services/
│       │   │   │   │   ├── components/
│       │   │   │   │   │   ├── ServiceForm.tsx
│       │   │   │   │   │   ├── ServiceList.tsx
│       │   │   │   │   │   └── index.ts
│       │   │   │   │   ├── pages/
│       │   │   │   │   │   └── ServiceManagementPage.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   │
│       │   │   │   ├── users/
│       │   │   │   │   ├── components/
│       │   │   │   │   │   ├── UserTable.tsx
│       │   │   │   │   │   ├── UserForm.tsx
│       │   │   │   │   │   └── index.ts
│       │   │   │   │   ├── pages/
│       │   │   │   │   │   └── UserManagementPage.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   │
│       │   │   │   └── dashboard/
│       │   │   │       ├── components/
│       │   │   │       │   ├── DashboardStats.tsx
│       │   │   │       │   ├── QuickActions.tsx
│       │   │   │       │   └── index.ts
│       │   │   │       ├── pages/
│       │   │   │       │   └── AdminDashboardPage.tsx
│       │   │   │       └── index.ts
│       │   │   │
│       │   │   └── notifications/
│       │   │       ├── components/
│       │   │       │   ├── NotificationBell.tsx
│       │   │       │   ├── NotificationPanel.tsx
│       │   │       │   ├── NotificationCard.tsx
│       │   │       │   └── index.ts
│       │   │       ├── pages/
│       │   │       │   └── NotificationsPage.tsx
│       │   │       ├── hooks/
│       │   │       │   └── useNotifications.ts
│       │   │       ├── api/
│       │   │       │   └── notificationsApi.ts
│       │   │       ├── types/
│       │   │       │   └── index.ts
│       │   │       └── index.ts
│       │   │
│       │   ├── shared/
│       │   │   ├── components/
│       │   │   │   ├── ui/
│       │   │   │   │   ├── button.tsx
│       │   │   │   │   ├── input.tsx
│       │   │   │   │   ├── dialog.tsx
│       │   │   │   │   ├── form.tsx
│       │   │   │   │   ├── index.ts
│       │   │   │   │   └── ... (other shadcn/ui components)
│       │   │   │   │
│       │   │   │   ├── layout/
│       │   │   │   │   ├── Header.tsx
│       │   │   │   │   ├── Footer.tsx
│       │   │   │   │   ├── Sidebar.tsx
│       │   │   │   │   ├── MainLayout.tsx
│       │   │   │   │   └── index.ts
│       │   │   │   │
│       │   │   │   └── common/
│       │   │   │       ├── Loader.tsx
│       │   │   │       ├── ErrorBoundary.tsx
│       │   │   │       ├── EmptyState.tsx
│       │   │   │       └── index.ts
│       │   │   │
│       │   │   ├── hooks/
│       │   │   │   ├── useApi.ts
│       │   │   │   ├── usePagination.ts
│       │   │   │   ├── useSort.ts
│       │   │   │   ├── useFilters.ts
│       │   │   │   ├── useToast.ts
│       │   │   │   ├── useMobile.ts
│       │   │   │   └── index.ts
│       │   │   │
│       │   │   ├── lib/
│       │   │   │   ├── api-client.ts
│       │   │   │   ├── auth-utils.ts
│       │   │   │   ├── validation.ts
│       │   │   │   ├── sanitization.ts
│       │   │   │   ├── formatting.ts
│       │   │   │   ├── constants.ts
│       │   │   │   ├── types.ts
│       │   │   │   └── index.ts
│       │   │   │
│       │   │   ├── store/
│       │   │   │   ├── authStore.ts
│       │   │   │   ├── uiStore.ts
│       │   │   │   └── index.ts
│       │   │   │
│       │   │   └── utils/
│       │   │       ├── format.ts
│       │   │       ├── validators.ts
│       │   │       ├── sanitize.ts
│       │   │       └── index.ts
│       │   │
│       │   └── pages/
│       │       ├── 404.tsx
│       │       ├── HomePage.tsx
│       │       └── index.ts
│       │
│       ├── public/
│       │   └── robots.txt
│       │
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── components.json
│
├── lib/
│   ├── api-spec/
│   │   ├── openapi.yaml
│   │   ├── orval.config.ts
│   │   └── package.json
│   │
│   ├── api-client-react/
│   │   ├── src/
│   │   │   ├── generated/
│   │   │   │   ├── packages-api.ts
│   │   │   │   ├── quotations-api.ts
│   │   │   │   ├── event-types-api.ts
│   │   │   │   ├── users-api.ts
│   │   │   │   └── index.ts
│   │   │   ├── custom-fetch.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── api-zod/
│   │   ├── src/
│   │   │   ├── generated/
│   │   │   │   └── schemas.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── db/
│       ├── src/
│       │   ├── schema/
│       │   │   ├── packages.ts
│       │   │   ├── quotations.ts
│       │   │   ├── event-types.ts
│       │   │   ├── menu-items.ts
│       │   │   ├── additional-services.ts
│       │   │   ├── users.ts
│       │   │   ├── wishlist.ts
│       │   │   └── index.ts
│       │   ├── seed.ts
│       │   └── index.ts
│       ├── drizzle.config.ts
│       ├── package.json
│       └── tsconfig.json
│
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
├── PROGRESS.md
└── README.md
```

---

## PART 4: NAMING CONVENTIONS & STANDARDS

### 4.1 **File Naming**

#### Frontend React Components

```typescript
// Container/Page components (Smart components)
[FeatureName]Page.tsx              // e.g., PackageBrowsePage.tsx
[FeatureName]Detail[Item]Page.tsx  // e.g., PackageDetailPage.tsx

// Presentational components (Dumb components)
[ComponentName].tsx                // e.g., PackageCard.tsx, QuotationForm.tsx
[ComponentName][Variant].tsx       // e.g., QuotationCardPending.tsx

// Hooks
use[HookName].ts                   // e.g., usePackages.ts, useCart.ts
use[Feature][Action].ts            // e.g., usePackageFilters.ts, useQuotationForm.ts

// Store files
[featureName]Store.ts              // e.g., packagesStore.ts, cartStore.ts

// API integration files
[featureName]Api.ts                // e.g., packagesApi.ts, quotationsApi.ts

// Type files
index.ts (inside types/)            // All types for a feature in one file
```

#### Backend Express Routes & Services

```typescript
// Route files
router.ts                          // Main router file in feature folder

// Service files
service.ts                         // Business logic for feature
[action]-service.ts                // e.g., auth-service.ts

// Controller files
controller.ts                      // Request/response handling

// Type files
types.ts                           // All types for feature
```

### 4.2 **Folder Naming**

```typescript
// Feature folders: kebab-case
features/
├── packages/
├── quotations/
├── event-types/
├── menu-items/
├── additional-services/
├── shopping-cart/
├── wishlist/
├── auth/
├── notifications/
└── admin/

// Internal feature folders
├── components/     // All React components for this feature
├── pages/          // Page-level components
├── hooks/          // Custom React hooks
├── store/          // Zustand stores
├── api/            // API integration functions
├── types/          // Type definitions
├── tests/          // Feature tests
└── utils/          // Feature-specific utilities (optional)
```

### 4.3 **Component Naming**

```typescript
// Feature components
<PackageCard />          // Reusable component
<PackageGrid />          // Container component
<PackageFilters />       // Feature-specific component
<AdminPackageForm />     // Admin-specific component

// Shared components
<Button />              // shadcn/ui component
<Dialog />              // Reusable dialog
<Card />                // Reusable card

// Avoid
<Product />             // Ambiguous, use <Package /> instead
<Item />                // Too generic
<Comp1 />               // Unclear purpose
```

### 4.4 **Hook Naming**

```typescript
// Data fetching
usePackages()                // Fetch all packages
usePackage(id)              // Fetch single package
useQuotations()             // Fetch quotations

// State management
useCart()                   // Manage cart state
useAuth()                   // Manage auth state
useFilters()                // Manage filter state

// Side effects
useSessionTimeout()         // Auto-logout on timeout
useNotifications()          // Listen to notifications

// UI state
useMobile()                 // Detect mobile
useToast()                  // Show toast notifications

// Avoid
useData()                   // Too vague
useFetch()                  // Too generic
useUtils()                  // Incorrect purpose
```

### 4.5 **Type Naming**

```typescript
// Database models
type Package = typeof packagesTable.$inferSelect;
type InsertPackage = typeof packagesTable.$inferInsert;

// API response types
type PackageResponse = Package & { menuItems: MenuItem[] };
type QuotationResponse = Quotation & { customer: User };

// Form types
type PackageFormData = z.infer<typeof packageSchema>;
type QuotationFormData = z.infer<typeof quotationSchema>;

// Props types
interface PackageCardProps {
  package: Package;
  onSelect?: (id: number) => void;
}

// Store types
interface PackagesStore {
  packages: Package[];
  loading: boolean;
  fetchPackages(): Promise<void>;
}

// Avoid
type Data = any;
type Props = Record<string, any>;
type Result = unknown;
```

### 4.6 **Store Naming**

```typescript
// Global stores
authStore.ts              // Authentication state
uiStore.ts                // Global UI state (theme, modals, etc.)

// Feature stores
packagesStore.ts          // Packages list and filters
cartStore.ts              // Shopping cart items
wishlistStore.ts          // Wishlist items
quotationBuilderStore.ts  // Quotation building state

// Avoid
globalStore.ts            // Too vague
appStore.ts               // Not specific enough
allData.ts                // Unclear purpose
```

### 4.7 **API/Database Tables**

```typescript
// Database table naming (plural, snake_case)
productsTable              // Packages (catering offerings)
categoriesTable            // Event types
ordersTable                // Quotations/Orders
menuItemsTable             // Menu items for packages
additionalServicesTable    // Add-on services
usersTable                 // User accounts
wishlistTable              // User wishlists

// API endpoint naming (kebab-case, plural)
/api/packages              // List all packages
/api/packages/:id          // Get single package
/api/packages/:id/menu-items  // Get menu items for package
/api/quotations            // List quotations
/api/quotations/:id        // Get quotation detail
/api/event-types           // List event types
/api/additional-services   // List services
/api/users                 // User management
```

### 4.8 **Class/Function Naming**

```typescript
// Service classes (PascalCase)
class PackageService {
  async getPackages() { ... }
  async getPackageById(id: number) { ... }
  async createPackage(data) { ... }
}

// Controller classes
class PackageController {
  async list(req, res) { ... }
  async getDetail(req, res) { ... }
}

// Utility functions (camelCase)
function formatPrice(price: number): string { ... }
function sanitizeInput(input: string): string { ... }
function calculateTotal(items: Item[]): number { ... }
```

---

## PART 5: MIGRATION PLAN

### Phase 1: Preparation (Day 1-2)

#### Step 1.1: Create New Directory Structure
- [ ] Create `artifacts/api-server/src/features/` directory
- [ ] Create `artifacts/api-server/src/shared/` directory
- [ ] Create `artifacts/shop/src/features/` directory
- [ ] Create `artifacts/shop/src/shared/` directory
- [ ] Create subdirectories for each feature

**Commands**:
```bash
# API Server
mkdir -p artifacts/api-server/src/features/{packages,quotations,menu-items,additional-services,event-types,users,notifications}
mkdir -p artifacts/api-server/src/features/*/tests
mkdir -p artifacts/api-server/src/shared/{types,constants,utils,validators}

# Frontend Shop
mkdir -p artifacts/shop/src/features/{packages,quotations,shopping-cart,event-types,wishlist,auth,admin,notifications}
mkdir -p artifacts/shop/src/features/auth/components
mkdir -p artifacts/shop/src/features/auth/{pages,hooks,api,types}
# ... (repeat for other features)
mkdir -p artifacts/shop/src/shared/{components/{ui,layout,common},hooks,lib,store,utils}
```

#### Step 1.2: Run Tests & Document Current State
- [ ] Run full test suite (if exists)
- [ ] Document current import paths
- [ ] Create git branch: `refactor/restructure-architecture`

#### Step 1.3: Update Linting & Import Alias Rules
- [ ] Update `tsconfig.json` paths for new structure
- [ ] Update ESLint rules for import organization

### Phase 2: API Server Refactoring (Day 3-5)

#### Step 2.1: Create Service Layer

Move business logic from routes to services:

```typescript
// artifacts/api-server/src/features/packages/service.ts
export class PackageService {
  async getAllPackages(filters?: PackageFilters) {
    // Business logic here
  }

  async getPackageById(id: number) {
    // Business logic here
  }

  async createPackage(data: InsertPackage) {
    // Business logic here
  }

  async updatePackage(id: number, data: Partial<InsertPackage>) {
    // Business logic here
  }

  async deletePackage(id: number) {
    // Business logic here
  }
}
```

#### Step 2.2: Create Controllers

Extract request/response handling:

```typescript
// artifacts/api-server/src/features/packages/controller.ts
export class PackageController {
  constructor(private service: PackageService) {}

  async list(req: Request, res: Response) {
    try {
      const packages = await this.service.getAllPackages(req.query);
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch packages' });
    }
  }

  async getDetail(req: Request, res: Response) {
    try {
      const package = await this.service.getPackageById(Number(req.params.id));
      if (!package) return res.status(404).json({ error: 'Not found' });
      res.json(package);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch package' });
    }
  }
}
```

#### Step 2.3: Create Feature Routers

Organize routes by feature:

```typescript
// artifacts/api-server/src/features/packages/router.ts
export function createPackagesRouter(
  service: PackageService,
  controller: PackageController
) {
  const router = Router();
  
  router.get('/', (req, res) => controller.list(req, res));
  router.get('/slug/:slug', (req, res) => controller.getBySlug(req, res));
  router.post('/', requireAdmin, (req, res) => controller.create(req, res));
  router.put('/:id', requireAdmin, (req, res) => controller.update(req, res));
  router.delete('/:id', requireAdmin, (req, res) => controller.delete(req, res));
  
  return router;
}
```

#### Step 2.4: Update Main App Router

```typescript
// artifacts/api-server/src/app.ts
import { createPackagesRouter } from './features/packages/router';
import { createQuotationsRouter } from './features/quotations/router';
// ... import other routers

export function setupRoutes(app: Express) {
  app.use('/api/packages', createPackagesRouter(...));
  app.use('/api/quotations', createQuotationsRouter(...));
  // ... setup other routes
}
```

#### Migration checklist for API Server:
- [ ] Move products.ts → features/packages/
- [ ] Move categories.ts → features/event-types/
- [ ] Move orders.ts → features/quotations/
- [ ] Move menuItems.ts → features/menu-items/
- [ ] Move additionalServices.ts → features/additional-services/
- [ ] Move users.ts → features/users/
- [ ] Extract services for each feature
- [ ] Extract controllers for each feature
- [ ] Update app.ts to use new routers
- [ ] Test all API endpoints

### Phase 3: Frontend Shop Refactoring (Day 6-10)

#### Step 3.1: Create Feature Structures

Organize components by feature:

**Packages Feature Example**:
```typescript
// artifacts/shop/src/features/packages/components/PackageCard.tsx
export const PackageCard: React.FC<PackageCardProps> = ({ package: pkg }) => {
  return (
    <div className="...">
      <h3>{pkg.title}</h3>
      <p>${pkg.pricePerPerson}/person</p>
    </div>
  );
};

// artifacts/shop/src/features/packages/pages/PackageBrowsePage.tsx
export const PackageBrowsePage: React.FC = () => {
  const { packages, loading } = usePackages();
  const { filters, setFilters } = usePackageFilters();
  
  return (
    <MainLayout>
      <Filters onFiltersChange={setFilters} />
      <PackageGrid packages={packages} loading={loading} />
    </MainLayout>
  );
};

// artifacts/shop/src/features/packages/hooks/usePackages.ts
export const usePackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Fetch logic
  }, []);
  
  return { packages, loading };
};

// artifacts/shop/src/features/packages/api/packagesApi.ts
export const packagesApi = {
  getAll: () => apiClient.get('/api/packages'),
  getById: (id: number) => apiClient.get(`/api/packages/${id}`),
  getBySlug: (slug: string) => apiClient.get(`/api/packages/slug/${slug}`),
};

// artifacts/shop/src/features/packages/index.ts
export * from './components';
export * from './pages';
export * from './hooks';
export * from './api';
export * from './types';
```

#### Step 3.2: Move Components to Features

**Components to move**:
- [ ] PackageItem.tsx → features/packages/components/
- [ ] PackageGrid.tsx → features/packages/components/
- [ ] ProductsSection.tsx → features/packages/components/
- [ ] Filters.tsx → features/packages/components/
- [ ] CartElement.tsx → features/shopping-cart/components/
- [ ] QuantityInput*.tsx → features/shopping-cart/components/
- [ ] Hero.tsx → features/packages/components/
- [ ] CategoryMenu.tsx → features/event-types/components/
- [ ] etc.

#### Step 3.3: Reorganize Pages

```typescript
// artifacts/shop/src/features/packages/pages/PackageBrowsePage.tsx
// Previously: artifacts/shop/src/pages/ShopPage.tsx

// artifacts/shop/src/features/packages/pages/PackageDetailPage.tsx
// Previously: artifacts/shop/src/pages/product/ProductPage.tsx

// artifacts/shop/src/features/quotations/pages/QuotationRequestPage.tsx
// New page for quotation requests

// artifacts/shop/src/features/shopping-cart/pages/CartPage.tsx
// Previously: artifacts/shop/src/pages/CartPage.tsx

// artifacts/shop/src/features/auth/pages/LoginPage.tsx
// Previously: artifacts/shop/src/pages/LoginPage.tsx

// artifacts/shop/src/features/auth/pages/RegisterPage.tsx
// Previously: artifacts/shop/src/pages/RegisterPage.tsx
```

#### Step 3.4: Refactor Shared Components

```typescript
// artifacts/shop/src/shared/components/layout/Header.tsx
// artifacts/shop/src/shared/components/layout/Footer.tsx
// artifacts/shop/src/shared/components/layout/MainLayout.tsx

// artifacts/shop/src/shared/components/common/Loader.tsx
// artifacts/shop/src/shared/components/common/EmptyState.tsx
// artifacts/shop/src/shared/components/common/ErrorBoundary.tsx

// artifacts/shop/src/shared/components/ui/button.tsx
// artifacts/shop/src/shared/components/ui/input.tsx
// ... (shadcn/ui components)
```

#### Step 3.5: Reorganize Hooks

```typescript
// Feature hooks
// artifacts/shop/src/features/packages/hooks/usePackages.ts
// artifacts/shop/src/features/packages/hooks/usePackageFilters.ts
// artifacts/shop/src/features/shopping-cart/hooks/useCart.ts
// artifacts/shop/src/features/auth/hooks/useAuth.ts

// Shared hooks
// artifacts/shop/src/shared/hooks/usePagination.ts
// artifacts/shop/src/shared/hooks/useSort.ts
// artifacts/shop/src/shared/hooks/useMobile.ts
// artifacts/shop/src/shared/hooks/useToast.ts
```

#### Step 3.6: Reorganize Stores

```typescript
// Feature stores
// artifacts/shop/src/features/packages/store/packagesStore.ts
// artifacts/shop/src/features/shopping-cart/store/cartStore.ts
// artifacts/shop/src/features/quotations/store/quotationBuilderStore.ts
// artifacts/shop/src/features/wishlist/store/wishlistStore.ts

// Shared stores
// artifacts/shop/src/shared/store/authStore.ts
// artifacts/shop/src/shared/store/uiStore.ts
```

#### Step 3.7: Reorganize Lib Utilities

```typescript
// artifacts/shop/src/shared/lib/api-client.ts
// artifacts/shop/src/shared/lib/auth-utils.ts
// artifacts/shop/src/shared/lib/validation.ts
// artifacts/shop/src/shared/lib/sanitization.ts
// artifacts/shop/src/shared/lib/formatting.ts
// artifacts/shop/src/shared/lib/constants.ts
// artifacts/shop/src/shared/lib/types.ts
```

#### Frontend migration checklist:
- [ ] Create feature folder structure
- [ ] Move package-related components
- [ ] Move quotation-related components
- [ ] Move shopping cart components
- [ ] Move auth components
- [ ] Move admin pages and components
- [ ] Move shared components to shared/components/
- [ ] Move hooks to appropriate locations
- [ ] Move stores to appropriate locations
- [ ] Move lib utilities to shared/lib/
- [ ] Update all import paths
- [ ] Update routing in App.tsx
- [ ] Test all pages and features

### Phase 4: Database Schema Reorganization (Day 11)

#### Step 4.1: Split Schema Files

```typescript
// lib/db/src/schema/packages.ts
export const productsTable = pgTable("products", { ... });
export const insertProductSchema = ...;

// lib/db/src/schema/quotations.ts
export const ordersTable = pgTable("orders", { ... });
export const insertOrderSchema = ...;

// lib/db/src/schema/event-types.ts
export const categoriesTable = pgTable("categories", { ... });

// lib/db/src/schema/menu-items.ts
export const menuItemsTable = pgTable("menu_items", { ... });

// lib/db/src/schema/additional-services.ts
export const additionalServicesTable = pgTable("additional_services", { ... });

// lib/db/src/schema/users.ts
export const usersTable = pgTable("users", { ... });

// lib/db/src/schema/wishlist.ts
export const wishlistTable = pgTable("wishlist", { ... });

// lib/db/src/schema/index.ts
export * from './packages';
export * from './quotations';
export * from './event-types';
export * from './menu-items';
export * from './additional-services';
export * from './users';
export * from './wishlist';
```

Database schema checklist:
- [ ] Create separate schema files for each table
- [ ] Update index.ts to export all schemas
- [ ] Update API server to use new imports
- [ ] Update frontend types to use new imports
- [ ] Test all database operations

### Phase 5: Update Imports & Dependencies (Day 12)

#### Step 5.1: Update TypeScript Paths

```typescript
// tsconfig.json (root)
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./artifacts/shop/src/*"],
      "@shared/*": ["./artifacts/shop/src/shared/*"],
      "@features/*": ["./artifacts/shop/src/features/*"],
      "@/types": ["./artifacts/shop/src/shared/types.ts"]
    }
  }
}
```

#### Step 5.2: Update All Imports

**Before**:
```typescript
import { ProductItem } from '@/components/ProductItem';
import { apiClient } from '@/lib/api';
import { useCart } from '@/store/cartStore';
```

**After**:
```typescript
import { PackageCard } from '@features/packages/components';
import { apiClient } from '@shared/lib/api-client';
import { useCart } from '@features/shopping-cart/hooks';
```

#### Step 5.3: Create Import Barrels

```typescript
// artifacts/shop/src/features/packages/index.ts
export * from './components/PackageCard';
export * from './components/PackageGrid';
export * from './pages/PackageBrowsePage';
export * from './hooks/usePackages';
export * from './api/packagesApi';
export * from './types';

// Then import as:
import { PackageCard, usePackages } from '@features/packages';
```

Imports checklist:
- [ ] Update all import paths in API server
- [ ] Update all import paths in frontend
- [ ] Update tsconfig.json paths
- [ ] Create barrel exports (index.ts) for each feature
- [ ] Run TypeScript compiler to verify
- [ ] Test that all imports resolve correctly

### Phase 6: Testing & Validation (Day 13-14)

#### Step 6.1: Build & Compile

```bash
pnpm run typecheck
pnpm run build
```

#### Step 6.2: Run Tests

```bash
pnpm run test
```

#### Step 6.3: Manual Testing

- [ ] Test all package browsing features
- [ ] Test quotation request flow
- [ ] Test shopping cart
- [ ] Test admin dashboard
- [ ] Test authentication
- [ ] Test filtering and search

#### Step 6.4: Code Review

- [ ] Review new structure with team
- [ ] Check for any missed imports
- [ ] Verify no circular dependencies
- [ ] Check consistency of naming

### Phase 7: Documentation & Cleanup (Day 15)

#### Step 7.1: Update Documentation

- [ ] Update README with new structure
- [ ] Update PROGRESS.md
- [ ] Create ARCHITECTURE.md documenting the structure
- [ ] Create CONTRIBUTING.md with guidelines

#### Step 7.2: Remove Old Files

- [ ] Delete old component files (after confirming all imports updated)
- [ ] Delete old lib files
- [ ] Delete old hooks files
- [ ] Delete old store files

#### Step 7.3: Final Checks

- [ ] Run full test suite
- [ ] Build production bundle
- [ ] Check bundle size hasn't increased significantly
- [ ] Performance testing

#### Step 7.4: Merge & Deploy

- [ ] Create pull request
- [ ] Get code review
- [ ] Merge to main
- [ ] Deploy to staging
- [ ] Deploy to production

---

## PART 6: DETAILED FILE MIGRATION MAP

### API Server Migration

| Current File | New Location | Changes |
|---|---|---|
| `routes/products.ts` | `features/packages/router.ts` | Split into router, service, controller |
| `routes/categories.ts` | `features/event-types/router.ts` | Split into router, service, controller |
| `routes/orders.ts` | `features/quotations/router.ts` | Split into router, service, controller |
| `routes/menuItems.ts` | `features/menu-items/router.ts` | Split into router, service, controller |
| `routes/additionalServices.ts` | `features/additional-services/router.ts` | Split into router, service, controller |
| `routes/users.ts` | `features/users/router.ts` | Split into router, service, controller |
| `routes/admin.ts` | `features/quotations/router.ts` | Merge with quotations |
| `routes/health.ts` | `shared/health-router.ts` | Keep as utility |
| `middlewares/auth.ts` | `features/users/auth-middleware.ts` | Move to users feature |
| `lib/logger.ts` | `shared/logger.ts` | Keep as shared utility |

### Frontend Shop Migration

| Current File | New Location | Changes |
|---|---|---|
| `pages/ShopPage.tsx` | `features/packages/pages/PackageBrowsePage.tsx` | Rename & reorganize |
| `pages/product/ProductPage.tsx` | `features/packages/pages/PackageDetailPage.tsx` | Rename & reorganize |
| `pages/CartPage.tsx` | `features/shopping-cart/pages/CartPage.tsx` | Move to feature |
| `pages/CheckoutPage.tsx` | Remove or convert to redirect | Replace with quotation flow |
| `pages/LoginPage.tsx` | `features/auth/pages/LoginPage.tsx` | Move to feature |
| `pages/RegisterPage.tsx` | `features/auth/pages/RegisterPage.tsx` | Move to feature |
| `pages/WishlistPage.tsx` | `features/wishlist/pages/WishlistPage.tsx` | Move to feature |
| `pages/SearchPage.tsx` | `features/packages/pages/SearchPage.tsx` | Move to packages feature |
| `pages/NotificationsPage.tsx` | `features/notifications/pages/NotificationsPage.tsx` | Move to feature |
| `pages/admin/*` | `features/admin/*/pages/` | Reorganize admin pages |
| `components/*` | `features/*/components/` or `shared/components/` | Distribute by feature |
| `hooks/*` | `features/*/hooks/` or `shared/hooks/` | Distribute by feature |
| `store/*` | `features/*/store/` or `shared/store/` | Distribute by feature |
| `lib/api.ts` | `shared/lib/api-client.ts` | Rename & move |
| `lib/auth-utils.ts` | `shared/lib/auth-utils.ts` | Keep in shared |
| `lib/constants.ts` | `shared/lib/constants.ts` | Keep in shared |
| `lib/validation.ts` | `shared/lib/validation.ts` | Keep in shared |
| `lib/sanitize.ts` | `shared/lib/sanitization.ts` | Keep in shared |
| `lib/format.ts` | `shared/lib/formatting.ts` | Keep in shared |
| `lib/notification-api.ts` | `features/notifications/api/notificationsApi.ts` | Move to feature |
| `lib/notification-helpers.ts` | `features/notifications/service.ts` | Move to feature |
| `types/notification.ts` | `features/notifications/types/index.ts` | Move to feature |

---

## PART 7: ARCHITECTURE IMPROVEMENTS

### 7.1 **API Server Improvements**

#### Add Service Layer
- Extract business logic from routes into services
- Enable reuse of business logic (e.g., in notifications, emails)
- Make testing easier by isolating logic

#### Add Controller Layer
- Handle request validation and response formatting
- Separate HTTP concerns from business logic
- Improve error handling consistency

#### Add Middleware Organization
- Group middleware by feature
- Create reusable middleware factories
- Better error handling across features

#### Add Validation Layer
- Centralized request validation using Zod
- Consistent error messages
- Type-safe validation

#### Example: Adding a Quotation Validation Middleware
```typescript
// features/quotations/validators.ts
export const quotationSchema = z.object({
  packageId: z.number(),
  eventDate: z.string().datetime(),
  guestCount: z.number().min(10).max(500),
  eventLocation: z.string(),
  message: z.string().optional(),
});

export const validateQuotation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = quotationSchema.parse(req.body);
    req.body = validated;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid quotation data' });
  }
};
```

### 7.2 **Frontend Improvements**

#### Better State Management
- Use feature-based stores instead of flat stores
- Clear separation between UI state and domain state
- Easier to understand store dependencies

#### Component Organization
- Feature components together with their hooks, stores, and types
- Easier to move features between projects
- Clear component hierarchy

#### Better Hook Organization
- Feature-specific hooks in feature folder
- Shared hooks in shared folder
- Easier to discover available hooks

#### Type Safety
- Centralized type definitions per feature
- Easier to update types without breaking changes
- Better IDE support

### 7.3 **Circular Dependency Prevention**

#### Import Patterns to Follow

**Good patterns**:
```typescript
// Feature → Shared (OK)
import { Button } from '@shared/components/ui';

// Feature → Feature (only if necessary)
import { PackageCard } from '@features/packages/components';

// Admin → Features (OK, admin depends on features)
import { usePackages } from '@features/packages/hooks';

// Features → Admin (NOT OK, prevent this)
// import { AdminPackageForm } from '@features/admin/packages';  ❌
```

#### Architectural Boundaries

```
  ┌─────────────────────────────┐
  │  Shared Layer               │  (Can be imported by anyone)
  │  (components, hooks, utils) │
  └─────────────────────────────┘
           ↑       ↑       ↑
           │       │       │
     ┌──────────┬─────────┬──────────┐
     │          │         │          │
 ┌────────┐ ┌────────┐ ┌────────┐ ┌─────────┐
 │Packages│ │Quotas  │ │Cart    │ │ Auth    │
 └────────┘ └────────┘ └────────┘ └─────────┘
  (Features - no cross-feature imports except shared)
```

### 7.4 **Error Handling**

#### Centralized Error Handling

```typescript
// shared/lib/error-handler.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: Record<string, any>
  ) {
    super(message);
  }
}

// API Server
export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      error: error.message,
      details: error.details,
    });
  }
  
  res.status(500).json({ error: 'Internal server error' });
};

// Frontend
export const useApiError = () => {
  const { error, setError } = useState<string | null>(null);
  
  const handleApiError = (error: unknown) => {
    if (error instanceof ApiError) {
      setError(error.message);
    } else {
      setError('Something went wrong');
    }
  };
  
  return { error, handleApiError };
};
```

### 7.5 **Testing Strategy**

#### Unit Tests
```typescript
// features/packages/service.test.ts
describe('PackageService', () => {
  let service: PackageService;
  
  beforeEach(() => {
    service = new PackageService(mockDb);
  });
  
  it('should return all packages', async () => {
    const packages = await service.getAllPackages();
    expect(packages).toHaveLength(3);
  });
});
```

#### Integration Tests
```typescript
// features/packages/router.test.ts
describe('GET /api/packages', () => {
  it('should return all packages', async () => {
    const response = await request(app)
      .get('/api/packages')
      .expect(200);
    
    expect(response.body).toHaveLength(3);
  });
});
```

#### Component Tests
```typescript
// features/packages/components/PackageCard.test.tsx
describe('PackageCard', () => {
  it('should render package details', () => {
    const { getByText } = render(
      <PackageCard package={mockPackage} />
    );
    
    expect(getByText('Test Package')).toBeInTheDocument();
  });
});
```

---

## PART 8: SCALABILITY RECOMMENDATIONS

### 8.1 **Monorepo Scaling**

When the project grows, consider:

1. **Micro-services** - Split api-server into separate services
2. **Shared libraries** - Create more shared packages
3. **Feature-based packages** - Each feature as its own package
4. **Plugin architecture** - Allow features to be plugged in/out

### 8.2 **Performance Optimization**

1. **Code Splitting** - Split features into separate chunks
2. **Lazy Loading** - Load feature components only when needed
3. **Tree Shaking** - Ensure unused code is removed
4. **Bundle Analysis** - Monitor bundle size

### 8.3 **Developer Experience**

1. **Documentation** - Keep README and ARCHITECTURE updated
2. **Scaffolding** - Create templates for new features
3. **Type Safety** - Strict TypeScript configuration
4. **Linting** - Enforce naming conventions and structure

### 8.4 **Feature Addition Process**

When adding a new feature:

1. Create feature folder structure
2. Create types first (schema-driven development)
3. Implement API routes (backend)
4. Implement hooks (data fetching)
5. Implement components (UI)
6. Implement pages (routing)
7. Add tests
8. Update documentation

---

## PART 9: IMPLEMENTATION PRIORITIES

### Priority 1: High Impact, Low Effort
1. **Create API Service Layer** - Biggest improvement to code quality
2. **Reorganize Components by Feature** - Improves discoverability
3. **Move Shared Utilities** - Clears up clutter

### Priority 2: High Impact, Medium Effort
1. **Reorganize Pages by Feature** - Improves navigation
2. **Split DB Schema Files** - Improves maintainability
3. **Update Type Definitions** - Improves type safety

### Priority 3: Medium Impact, Medium Effort
1. **Create Admin Feature** - Better organization of admin pages
2. **Add Service Layer to Frontend** - Improves testability
3. **Add Error Handling** - Improves reliability

### Priority 4: Nice to Have, Low/Medium Effort
1. **Add Feature Scaffolding** - Improves DX
2. **Add Documentation** - Improves onboarding
3. **Add Lint Rules** - Enforces structure

---

## PART 10: IMMEDIATE NEXT STEPS

### For the Next Developer Session:

1. **Review this document** (30 mins)
   - Understand the proposed structure
   - Understand the problems with current structure

2. **Backup current code** (5 mins)
   - Create git branch: `refactor/restructure-architecture`

3. **Create directory structure** (15 mins)
   - Create all folders as outlined in Phase 1

4. **Start API Server Refactoring** (2-3 hours)
   - Create PackageService
   - Create PackageController
   - Create packages router
   - Move remaining routes

5. **Update imports** (1-2 hours)
   - Update app.ts to use new routers
   - Test API endpoints

6. **Create TypeScript type safety** (30 mins)
   - Update tsconfig.json paths
   - Verify all types are correct

---

## CONCLUSION

This refactoring will transform the CaterMarket codebase from a scattered, layer-based organization to a **clean, feature-first architecture**. This structure will:

✅ **Improve Discoverability** - Developers can quickly find files related to a feature  
✅ **Reduce Coupling** - Features are more independent  
✅ **Improve Testability** - Clear boundaries between concerns  
✅ **Enable Growth** - Easy to add new features  
✅ **Reduce Bugs** - Clear responsibilities and boundaries  
✅ **Speed Up Onboarding** - New developers understand structure immediately  

The migration can be completed in **approximately 2-3 weeks** of focused development, and the resulting codebase will be significantly more maintainable and scalable for future growth.

---

**Document Version**: 1.0  
**Last Updated**: June 21, 2026  
**Status**: Ready for Implementation
