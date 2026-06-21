# Singitronic Electronics Shop

A full-stack electronics e-commerce app migrated from Next.js to the Replit pnpm workspace stack (Vite + React + Express + PostgreSQL).

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/shop run dev` — run the frontend (port 24349, preview at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7, Tailwind v4, Wouter routing, Zustand state, react-hot-toast
- API: Express 5 (artifact: `artifacts/api-server`, port 8080)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/shop/` — React + Vite frontend
- `artifacts/shop/src/pages/` — all page components (HomePage, ShopPage, ProductPage, CartPage, CheckoutPage, LoginPage, RegisterPage, SearchPage, NotificationsPage, WishlistPage, admin/*)
- `artifacts/shop/src/components/` — all UI components
- `artifacts/shop/src/store/` — Zustand stores (cartStore, wishlistStore, sortStore, paginationStore)
- `artifacts/shop/src/hooks/useAuth.ts` — JWT auth hook (localStorage-based session)
- `artifacts/api-server/src/routes/` — Express REST API (products, categories, users, orders, admin)
- `lib/db/src/schema/index.ts` — Drizzle ORM schema (products, categories, users, orders, wishlist tables)

## Architecture decisions

- Auth replaced: next-auth → custom JWT-based auth via Express `/api/auth/login` + `/api/register`; session persisted in localStorage
- Routing replaced: Next.js App Router → Wouter v3 in React SPA
- Image tags: Next.js `Image` → standard `<img>` tags
- State management: Zustand stores persist cart in sessionStorage; wishlist in memory
- API calls: all frontend API calls go through `artifacts/shop/src/lib/api.ts` pointing to the Express backend via relative `/api/*` paths (proxied by Vite dev server)

## Product

- Browse products by category, search, filter by price/availability, sort by title/price
- Full product detail pages with description, stock status, add-to-cart / buy-now
- Shopping cart with quantity management and order summary
- Checkout flow with order placement
- Wishlist management
- User registration and login
- Admin dashboard (products, orders, users, categories management)

## Gotchas

- Run `pnpm --filter @workspace/db run push` after any schema changes before starting the API server
- The Vite dev server proxies `/api/*` to the Express server on port 8080
- Cart is stored in sessionStorage (persists across page refreshes but not across browser sessions)
- Passwords are hashed with SHA-256 (suitable for dev; upgrade to bcrypt for production)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
