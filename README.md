# Ticket — Food Ordering System

**Live demo:** [food-ordering-system-gilt-chi.vercel.app](https://food-ordering-system-gilt-chi.vercel.app)
*(Try the [menu](https://food-ordering-system-gilt-chi.vercel.app/menu) directly)*

A full-stack Next.js (App Router) + TypeScript + Tailwind CSS food ordering
app, backed by a real PostgreSQL database via Prisma.

## Features

- **Real accounts** — signup/login with hashed passwords, session cookie
- **Menu** — served from the database, searchable and filterable by category
- **Cart** — add/remove items client-side, quantities in `localStorage`
- **Checkout** — requires sign-in; creates a real `Order` + `OrderItem` rows,
  prices are re-validated server-side against the database (not trusted from
  the client)
- **Orders** — each signed-in user sees their own real order history with a
  status tracker
- **Profile** — edit and persist your name/phone/address
- **Admin** — dashboard reading real orders and menu items from the
  database, restricted to accounts with `role = "admin"`

## Getting started (run it locally)

```bash
npm install
cp .env.example .env
npm run db:reset    # pushes the schema and loads seed data into your database
npm run dev
```

Visit http://localhost:3000.

`npm install` runs `prisma generate` automatically (see the `postinstall`
script in `package.json`).

Before running the app, set `DATABASE_URL` (and `DIRECT_URL`, if your
provider requires a separate direct connection — e.g. Neon) in your `.env`
file to point to a real PostgreSQL database.

### Demo accounts

`npm run db:reset` seeds one admin account:

```
admin@ticket.app / admin123
```

Any other login goes through **Create account** on the login page — that
creates a real row in the `User` table.

## Database

Uses **PostgreSQL** (`prisma/schema.prisma`), connected via `DATABASE_URL`
(and `DIRECT_URL` for providers like Neon that separate pooled vs. direct
connections). Role/category/status/payment fields are plain strings rather
than native enums, validated in application code (see `lib/validators.ts`).

Useful commands:

```bash
npm run db:push     # sync the schema to the database
npm run db:seed     # (re)load menu items + demo admin
npm run db:reset     # force-reset + push + seed, in one step
npm run db:studio    # open Prisma Studio, a GUI to browse/edit data
```

## Project structure

```
app/
  api/            Route handlers — the real backend (auth, orders, menu, admin)
  admin/          Admin dashboard (server component, role-checked)
  cart/           Client-side cart (localStorage)
  checkout/       Places a real order via POST /api/orders
  login/          Signup + login forms
  menu/           Menu grid, fetches GET /api/menu
  orders/         Server component reading the signed-in user's real orders
  profile/        Reads/writes GET+PATCH /api/auth/me
components/       Reusable UI components
lib/              db.ts (Prisma client), auth.ts (sessions/hashing), utils.ts
prisma/           schema.prisma + seed.ts
types/            Shared TypeScript types
public/           Static assets (logo, category images)
```
