import { FoodCategory } from "@/types";

// Menu items and orders now live in the database (see prisma/schema.prisma
// and prisma/seed.ts) and are fetched via the API routes under app/api/.
// This file only keeps static UI config that isn't user data.

export const CATEGORIES: { id: FoodCategory; label: string; emoji: string }[] = [
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "burgers", label: "Burgers", emoji: "🍔" },
  { id: "asian", label: "Asian", emoji: "🍜" },
  { id: "desserts", label: "Desserts", emoji: "🍰" },
  { id: "drinks", label: "Drinks", emoji: "🥤" },
];
