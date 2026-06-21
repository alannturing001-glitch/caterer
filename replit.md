# CaterMarket — Catering Marketplace & Quotation System

A full-stack catering marketplace transformed from an electronics e-commerce app. Built on the Replit pnpm workspace stack (Vite + React + Express + PostgreSQL).

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/shop run dev` — run the frontend (port via $PORT, preview at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `npx tsx lib/db/src/seed.ts` — seed database with sample packages and event types
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — JWT signing secret

## Default Admin Credentials

- Email: `admin@catermarket.com`
- Password: `Admin1234!`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7, Tailwind v4, Wouter routing, Zustand state, react-hot-toast
- API: Express 5 (artifact: `artifacts/api-server`, port 8080)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/shop/` — React + Vite frontend
- `artifacts/shop/src/pages/` — all page components (HomePage, ShopPage/Browse Packages, ProductPage/Package Details, CartPage, CheckoutPage, LoginPage, RegisterPage, SearchPage, admin/*)
- `artifacts/shop/src/components/` — all UI components (Hero, PackageItem, PackagesSection, HowItWorks, CategoryMenu, Filters, etc.)
- `artifacts/shop/src/store/` — Zustand stores (cartStore, wishlistStore, sortStore, paginationStore)
- `artifacts/shop/src/hooks/useAuth.ts` — JWT auth hook (localStorage-based session)
- `artifacts/api-server/src/routes/` — Express REST API (products/packages, categories/event-types, users, orders/quotations, admin, menu-items, additional-services)
- `lib/db/src/schema/index.ts` — Drizzle ORM schema (products, categories, users, orders, wishlist, menuItems, additionalServices tables)
- `lib/db/src/seed.ts` — Seed script for demo packages, event types, and admin user

## Domain Mapping

| Original         | CaterMarket    |
|------------------|----------------|
| Products         | Packages       |
| Categories       | Event Types    |
| Orders           | Quotations     |
| Cart/Checkout    | Quotation Builder (inline on ProductPage) |

## Architecture decisions

- Auth: custom JWT-based auth via Express `/api/auth/login` + `/api/register`; session persisted in localStorage
- Routing: Wouter v3 in React SPA; `/packages` and `/packages/:slug*` routes alias `ShopPage`
- Quotation flow: inline form on ProductPage (guest slider, event date, location, message, live price estimate)
- Categories support `icon` (emoji) field via POST `/api/categories`
- Passwords hashed with bcryptjs
- POST `/api/orders` is open (no requireAuth) for guest quotation requests
- GET `/api/orders` requires admin
- Products table extended with: `pricePerPerson`, `minGuests`, `maxGuests`, `duration`
- Orders table extended with: `eventDate`, `eventLocation`, `guestCount`, `message`, `selectedMenuItems`, `selectedServices`
- New tables: `menuItemsTable`, `additionalServicesTable`

## Product Features

- Homepage: Hero, IntroducingSection, Event Type menu (emoji-based), HowItWorks (4 steps), FeaturedPackages, Incentives, Newsletter
- Browse Packages: filter by availability/price, sort, search by category slug
- Package Detail: quotation builder with guest slider, live price estimate, event date/location picker
- Admin: Dashboard (stats + quick actions), Packages management, Quotations (with status dropdown: pending/quoted/accepted/booked/rejected), Event Types (with emoji picker), Users, Settings

## Gotchas

- Run `pnpm --filter @workspace/db run push` after any schema changes before starting the API server
- The Vite dev server proxies `/api/*` to the Express server on port 8080
- Cart/Checkout pages redirect to Packages (no cart flow — quotation-based)
- `inStock` field on products is stored as integer (1/0), not boolean
- Products `category` field is text (denormalized); `categoryId` is not in the products schema

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
