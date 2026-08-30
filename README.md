# Ticket — Food Ordering System

A full-stack Next.js (App Router) + TypeScript + Tailwind CSS food ordering
app, backed by a real SQLite database via Prisma. Built for an IGNOU BCA
final semester project (BCSP-064).

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

## Getting started

```bash
npm install
cp .env.example .env
npm run db:reset    # creates the SQLite file, tables, and seed data
npm run dev
```

Visit http://localhost:3000.

`npm install` runs `prisma generate` automatically (see the `postinstall`
script in `package.json`).

### Demo accounts

`npm run db:reset` seeds one admin account:

```
admin@ticket.app / admin123
```

Any other login goes through **Create account** on the login page — that
creates a real row in the `User` table.

## Database

Uses SQLite (`prisma/schema.prisma`, `DATABASE_URL="file:./dev.db"`) — a
single file, no server to install or configure. Good enough for a project
demo; swapping to PostgreSQL/MySQL later only means changing the
`datasource` block and re-running `db:push`.

Useful commands:

```bash
npm run db:push     # sync the schema to the database
npm run db:seed     # (re)load menu items + demo admin
npm run db:reset     # wipe + push + seed, in one step
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

## How auth works (kept intentionally simple for a course project)

- Passwords are hashed with `bcryptjs` before being stored.
- On login/signup, a session cookie is set containing `<userId>.<hmac>`,
  signed with `SESSION_SECRET` from `.env` — tampering with the cookie
  invalidates it.
- `lib/auth.ts#getSessionUser()` reads and verifies that cookie in server
  components and route handlers.
- This is a from-scratch minimal implementation, not a library like
  NextAuth — intentional, so the auth flow is easy to explain in a viva/demo.

## Notes for the project report

- **ER diagram**: derive it directly from `prisma/schema.prisma` — `User`
  1-to-many `Order`, `Order` 1-to-many `OrderItem`, `OrderItem` many-to-1
  `FoodItem`.
- **DFD**: the API routes under `app/api/` map cleanly to processes (Login,
  Place Order, View Menu, Admin View Orders); `dev.db` is the single data
  store.
- Add screenshots after `npm run dev` — the styled UI (menu grid, checkout,
  admin dashboard) is presentation-ready as-is.
