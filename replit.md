# CaterMarket

A full-stack catering marketplace web application where customers browse and book catering packages, and caterers manage their menu items and packages through a built-in admin dashboard.

---

## Run & Operate

| Command | What it does |
|---|---|
| `pnpm --filter @workspace/api-server run dev` | Start the API server (port 8080) |
| `pnpm --filter @workspace/shop run dev` | Start the frontend (port from `$PORT`) |
| `pnpm run typecheck` | Full typecheck across all packages |
| `pnpm run build` | Typecheck + build all packages |
| `pnpm --filter @workspace/db run push` | Push DB schema changes to the database (dev only) |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate API hooks and Zod schemas from OpenAPI spec |

**Required environment variable:** `DATABASE_URL` — PostgreSQL connection string (set automatically by Replit's built-in Postgres integration).

**Promote a user to admin:**
```bash
psql $DATABASE_URL -c "UPDATE users SET role='admin' WHERE email='your@email.com'"
```

---

## Stack

| Layer | Technology |
|---|---|
| Monorepo | pnpm workspaces, Node.js 24, TypeScript 5.9 |
| Frontend | React, Vite, Wouter (v3 routing), Tailwind CSS |
| Backend | Express 5, Node.js |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod (`zod/v4`), `drizzle-zod` |
| API contract | OpenAPI spec → Orval codegen (hooks + Zod schemas) |
| Build | esbuild (CJS bundle for API server) |

---

## Where Things Live

```
/
├── artifacts/
│   ├── shop/                  # React frontend (Vite)
│   │   └── src/
│   │       ├── App.tsx        # All routes (public + admin)
│   │       ├── pages/
│   │       │   ├── admin/     # Admin dashboard pages
│   │       │   │   ├── AdminMenuItems.tsx        # Menu items list
│   │       │   │   ├── AdminMenuItemForm.tsx     # Add / edit menu item
│   │       │   │   ├── AdminProducts.tsx         # Packages list
│   │       │   │   ├── AdminProductForm.tsx      # Package builder (live preview)
│   │       │   │   ├── AdminOrders.tsx           # Orders / bookings
│   │       │   │   └── AdminUsers.tsx            # User management
│   │       │   └── (public pages)
│   │       ├── components/
│   │       │   └── DashboardSidebar.tsx          # Collapsible admin nav
│   │       └── hooks/useAuth.ts                  # JWT auth hook
│   │
│   └── api-server/            # Express API
│       └── src/
│           ├── routes/index.ts           # All routers mounted here
│           └── features/
│               ├── users/               # Auth + user CRUD
│               ├── products/            # Packages CRUD
│               ├── menuItems/           # Menu items CRUD
│               ├── orders/              # Bookings
│               ├── categories/          # Package categories
│               ├── quotations/          # Quote requests
│               └── additionalServices/  # Add-ons (staffing, equipment)
│
├── lib/
│   ├── db/src/schema/index.ts   # ⭐ Source of truth for DB schema (Drizzle)
│   ├── db/src/seed.ts           # Seed data
│   ├── api-spec/openapi.yaml    # ⭐ Source of truth for API contract
│   ├── api-client-react/        # Generated React query hooks (do not edit)
│   └── api-zod/                 # Generated Zod schemas (do not edit)
│
└── scripts/                     # Dev utilities
```

---

## Database Schema

All tables are defined in `lib/db/src/schema/index.ts`. Run `pnpm --filter @workspace/db run push` after any schema change.

| Table | Key Columns |
|---|---|
| `users` | `id`, `email`, `passwordHash`, `role` (`user`\|`admin`), `name`, `phone` |
| `products` | `id`, `slug`, `title`, `description`, `price`, `minGuests`, `maxGuests`, `pricingModel`, `serviceFee`, `deliveryFee`, `packageSections` (jsonb), `customizationRules` (jsonb), `availableLocations`, `bookingNotice`, `maxEventsPerDay` |
| `menu_items` | `id`, `name`, `description`, `categoryId`, `baseCost`, `sellingPrice`, `available`, `preparationTime`, `servingSize`, `minimumQuantity`, `dietary` (jsonb), `images` (jsonb) |
| `categories` | `id`, `name`, `slug`, `description` |
| `orders` | `id`, `userId`, `eventDate`, `guestCount`, `location`, `status`, `totalAmount`, `selectedMenuItems` (jsonb) |
| `additional_services` | `id`, `name`, `description`, `price`, `unit` |
| `wishlist` | `id`, `userId`, `productId` |

### JSONB formats

**`packageSections`** (on `products`):
```json
[{ "key": "starters", "label": "Starters", "selectedIds": [1, 3] }]
```

**`customizationRules`** (on `products`):
```json
{
  "allowGuestCountChanges": true,
  "allowMenuSwaps": false,
  "allowAddOns": true,
  "minimumNoticeHours": 48
}
```

**`dietary`** (on `menu_items`):
```json
["vegetarian", "gluten-free"]
```

---

## API Endpoints

Base path: `/api` — the Vite dev server proxies `/api` to port 8080.

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login, returns JWT |

### Users
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users` | Admin | List all users |
| `GET` | `/api/users/:id` | Admin | Get user by ID |
| `GET` | `/api/users/email/:email` | Self or Admin | Get user by email |
| `PUT` | `/api/users/:id` | Admin | Update user |
| `DELETE` | `/api/users/:id` | Admin | Delete user |

### Packages (Products)
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List all packages |
| `GET` | `/api/products/:id` | Public | Get package by ID |
| `GET` | `/api/products/slug/:slug` | Public | Get package by slug |
| `POST` | `/api/products` | Admin | Create package |
| `PUT` | `/api/products/:id` | Admin | Update package |
| `DELETE` | `/api/products/:id` | Admin | Delete package |

### Menu Items
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/menu-items` | Public | List all menu items |
| `GET` | `/api/menu-items/:id` | Public | Get menu item by ID |
| `POST` | `/api/menu-items` | Admin | Create menu item |
| `PUT` | `/api/menu-items/:id` | Admin | Update menu item |
| `DELETE` | `/api/menu-items/:id` | Admin | Delete menu item |

### Orders & Bookings
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/orders` | Admin | List all orders |
| `POST` | `/api/orders` | User | Place a booking |
| `GET` | `/api/users/:userId/quotations` | Self or Admin | User's quote history |

### Other
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/categories` | Public | List categories |
| `GET` | `/api/additional-services` | Public | List add-on services |

---

## Frontend Routes

Defined in `artifacts/shop/src/App.tsx`.

### Public
| Path | Page |
|---|---|
| `/` | Home — hero, featured packages |
| `/shop` or `/packages` | Browse all packages (filters, sort) |
| `/product/:slug` | Package detail + booking |
| `/search` | Search results |
| `/login` | Login form |
| `/register` | Registration form |

### User (authenticated)
| Path | Page |
|---|---|
| `/cart` | Cart / booking summary |
| `/checkout` | Checkout + event details |
| `/wishlist` | Saved packages |
| `/notifications` | User notifications |

### Admin (requires `role = admin`)
| Path | Page |
|---|---|
| `/admin` | Dashboard overview |
| `/admin/menu-items` | Menu items list |
| `/admin/menu-items/new` | Add menu item |
| `/admin/menu-items/:id/edit` | Edit menu item |
| `/admin/products` | Packages list |
| `/admin/products/new` | Package builder |
| `/admin/products/:id/edit` | Edit package |
| `/admin/orders` | Bookings management |
| `/admin/users` | User management |

---

## Architecture Decisions

- **JWT in localStorage** — `useAuth` hook reads `auth-token` key. The API server validates `Authorization: Bearer <token>` on protected routes via `authenticateToken` middleware.
- **Wouter v3 routing** — `useLocation()` returns the pathname only (no query string). Use `window.location.search` to access query parameters.
- **Legacy route files vs. feature routers** — `artifacts/api-server/src/routes/index.ts` mounts legacy route files (`products`, `categories`, `orders`) **before** the feature routers to preserve backward compatibility without breaking existing consumers.
- **JSONB columns for flexible data** — `packageSections`, `customizationRules`, `dietary`, and `images` are stored as PostgreSQL `jsonb` for flexibility without schema migrations on each format change.
- **Drizzle push (not migrations)** — Development uses `drizzle-kit push` for rapid iteration. For production, generate and run migration SQL files.
- **Vite proxy** — All `/api/*` requests in the frontend are proxied to `http://localhost:8080` by Vite, so no CORS configuration is needed in development.

---

## Gotchas

- **Always restart the API server** after editing any file in `artifacts/api-server/src/` — esbuild bundles on start, changes are not hot-reloaded.
- **Schema changes require a push** — after editing `lib/db/src/schema/index.ts`, run `pnpm --filter @workspace/db run push` or the DB will be out of sync.
- **Codegen is manual** — after editing `lib/api-spec/openapi.yaml`, run `pnpm --filter @workspace/api-spec run codegen` to regenerate hooks and schemas.
- **Seeded admin credentials** — `admin@test.com` / `admin123`. After registering any user, promote them with the psql command in the "Run & Operate" section above.
- **Generated files** — never edit `lib/api-client-react/` or `lib/api-zod/` directly; they are regenerated by Orval from the OpenAPI spec.

---

## Product

CaterMarket lets event planners browse, filter, and book catering packages from professional caterers. Key capabilities:

- **Marketplace** — Browse packages by category, dietary tags, and price; filter by guest count; see real-time availability.
- **Package Detail** — Full menu breakdown, add-on services (staffing, equipment), guest-count customization, and direct booking.
- **Caterer Dashboard** — Caterers manage their menu items (with dietary flags, pricing, availability) and build packages using a drag-and-drop Package Builder with a live preview panel.
- **Order Management** — Admins review and update bookings, track event dates and guest counts.
- **User Management** — Admins promote users to admin, view registration history.

---

## User Preferences

- Keep admin pages consistent with the existing `DashboardSidebar.tsx` navigation pattern (collapsible groups).
- Use KES (Kenyan Shillings) as the currency throughout.
- Dietary options: Vegetarian, Vegan, Halal, Gluten Free, Dairy Free.
