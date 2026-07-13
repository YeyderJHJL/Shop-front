# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

`shop-front` is the frontend for a food-waste-reduction marketplace: customers buy near-expiry / surplus food at discounted prices. It hosts **two user roles**:

- **Cliente** — the shopping app under `Layout` (`/`, `/product/:id`, `/cart`, `/checkout`, `/profile`, plus `/login` and `/register`).
- **Administrador** — the management panel under `AdminLayout`, guarded by `RequireAdmin` (role `admin` only): `/admin` (dashboard), `/admin/productos`, `/admin/usuarios`, `/admin/ofertas`, `/admin/pedidos`.

There is no backend yet. All data is mock/seed and mutated client-side.

### Architecture

- **State** lives in React contexts under `src/context/`:
  - `DataContext` — shared store for `products`, `users`, `orders`, `offers` with CRUD, seeded from `src/data/*.ts` and persisted to `localStorage` (`shop-admin-data`). Both the client app and the admin panel read/write through `useData()`.
  - `AuthContext` — `useAuth()` resolves a user's role by matching their email against `src/data/users.ts`; `isAdmin` and `login()` (returns the resolved user) drive role-based redirects. Demo accounts: `admin@shop.com` (admin), `jturpoan@unsa.edu.pe` (cliente); any password.
  - `CartContext` — client shopping cart.
- **Types** in `src/types.ts`: `Product` (with `originalPrice`, `stock`, `expiryDate`), `User` (`role`, `status`), `Order`/`OrderItem`, `Offer`.
- **Admin UI** in `src/components/admin/` (`AdminLayout`, `RequireAdmin`, `Modal`, `FormField`) and `src/pages/admin/`.
- Provider nesting (`src/main.tsx`): `DataProvider > AuthProvider > CartProvider`.

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
