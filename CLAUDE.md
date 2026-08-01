# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

`shop-front` is the frontend for a food-waste-reduction marketplace: customers buy near-expiry / surplus food at discounted prices. It hosts **two user roles**:

- **Cliente** — the shopping app under `Layout` (`/`, `/product/:id`, `/cart`, `/checkout`, `/profile`, plus `/login` and `/register`).
- **Administrador** — the management panel under `AdminLayout`, guarded by `RequireAdmin` (role `admin` only): `/admin` (dashboard), `/admin/productos`, `/admin/usuarios`, `/admin/ofertas`, `/admin/pedidos`.

This frontend consumes the **Shop-back** REST API (Express + Prisma + PostgreSQL). All CRUD, auth, orders and dashboard metrics go through it — there is no more mock data.

### Architecture

- **`src/lib/api.ts`** is the single gateway to the backend. It holds the JWT (`localStorage` key `shop-token`), attaches `Authorization: Bearer`, and maps between backend DTOs and the frontend types — including the enum translations: order status `PENDING/PREPARING/COMPLETED/CANCELLED` ↔ `pendiente/preparando/entregado/cancelado`, role `ADMIN/CLIENT` ↔ `admin/cliente`, user status `ACTIVE/INACTIVE` ↔ `activo/inactivo`. Base URL comes from `VITE_API_URL`. The repo ships `.env` / `.env.production` pointing at the **deployed API** (`https://shop-back-o6wo.onrender.com/api`); the in-code default is `http://localhost:3000/api` for local backend work. **All entity IDs are strings (UUIDs)**, not numbers.
- **State** lives in React contexts under `src/context/`:
  - `AuthContext` — `useAuth()`; async `login(email, password)` / `register(name, email, password)` hit the API, persist the token + user, and rehydrate on reload. `isAdmin` drives role-based redirects.
  - `DataContext` — `useData()`; API-backed store for `products`, `users`, `orders`, `offers`. Loads the public catalog (products, offers) always, and users + orders only when an admin is authenticated. Its CRUD methods are **async** (call the API then refetch).
  - `CartContext` — client shopping cart; `Checkout` turns the cart into a real `POST /orders`.
- **Types** in `src/types.ts`: `Product` (`price`, `originalPrice`, `category`, `stock`, `expiryDate`), `User` (`role`, `status`), `Order`/`OrderItem`, `Offer`.
- **Admin UI** in `src/components/admin/` and `src/pages/admin/`. `AdminDashboard` fetches `GET /dashboard/metrics` (sales, orders-by-status, top products, users, sales-by-date).
- Provider nesting (`src/main.tsx`): `AuthProvider > DataProvider > CartProvider` — Auth is outermost so Data can react to login state.
- Demo accounts on the deployed DB: `admin@shop.com` / `admin123` (admin), `cliente@feliz.com` / `cliente123` (cliente). Login/register hit the live Render API, so no local backend is needed (the free Render instance may cold-start for a few seconds on the first request).

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then produce a production build; **the build fails on any TypeScript error**
- `npm run lint` — run Oxlint (Rust-based linter, not ESLint)
- `npm run preview` — serve the production build locally

There is no test runner configured yet — `npm test` does not exist.

## Toolchain notes

- **React 19** with the new JSX transform (`jsx: "react-jsx"`) — no need to `import React` in components.
- **Oxlint** is the linter (config in `.oxlintrc.json`), enabling the `react`, `typescript`, and `oxc` plugins. `react/rules-of-hooks` is an error. Type-aware lint rules are *not* enabled (would require installing `oxlint-tsgolint`).
- **TypeScript** uses project references: `tsconfig.json` delegates to `tsconfig.app.json` (app code under `src/`) and `tsconfig.node.json` (Vite config). Bundler module resolution is on, with `allowImportingTsExtensions` — so relative imports include the extension (e.g. `import App from './App.tsx'`). `noUnusedLocals` and `noUnusedParameters` are enforced, so unused symbols break the build.
- **Static assets**: files under `src/assets/` are imported as modules; files in `public/` (e.g. `/icons.svg`, `/favicon.svg`) are referenced by absolute URL at runtime.

## Entry points

- `index.html` → loads `src/main.tsx`
- `src/main.tsx` mounts `<App />` into `#root` inside `<StrictMode>`
