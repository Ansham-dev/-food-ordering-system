import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const FOOD_ITEMS = [
  {
    id: "pz-1",
    name: "Margherita Pizza",
    description: "Classic tomato, fresh mozzarella, basil.",
    price: 249,
    category: "pizza",
    image: "/images/pizza/margherita.jpg",
    rating: 4.6,
    isPopular: true,
    isVegetarian: true,
    prepTimeMinutes: 20,
  },
  {
    id: "pz-2",
    name: "Pepperoni Pizza",
    description: "Loaded with pepperoni and mozzarella.",
    price: 329,
    category: "pizza",
    image: "/images/pizza/pepperoni.jpg",
    rating: 4.7,
    isPopular: true,
    prepTimeMinutes: 20,
  },
  {
    id: "bg-1",
    name: "Classic Cheeseburger",
    description: "Beef patty, cheddar, lettuce, house sauce.",
    price: 199,
    category: "burgers",
    image: "/images/burgers/cheeseburger.jpg",
    rating: 4.5,
    prepTimeMinutes: 15,
  },
  {
    id: "bg-2",
    name: "Crispy Veg Burger",
    description: "Crispy veg patty, mayo, pickles.",
    price: 159,
    category: "burgers",
    image: "/images/burgers/veg-burger.jpg",
    rating: 4.3,
    isVegetarian: true,
    prepTimeMinutes: 15,
  },
  {
    id: "as-1",
    name: "Chicken Ramen",
    description: "Rich broth, soft noodles, soft egg.",
    price: 289,
    category: "asian",
    image: "/images/asian/ramen.jpg",
    rating: 4.8,
    isPopular: true,
    prepTimeMinutes: 25,
  },
  {
    id: "as-2",
    name: "Veg Fried Rice",
    description: "Wok-tossed rice, seasonal vegetables.",
    price: 179,
    category: "asian",
    image: "/images/asian/fried-rice.jpg",
    rating: 4.2,
    isVegetarian: true,
    prepTimeMinutes: 15,
  },
  {
    id: "ds-1",
    name: "Molten Chocolate Cake",
    description: "Warm cake with a gooey chocolate center.",
    price: 149,
    category: "desserts",
    image: "/images/desserts/molten-cake.jpg",
    rating: 4.9,
    isPopular: true,
    isVegetarian: true,
    prepTimeMinutes: 10,
  },
  {
    id: "dr-1",
    name: "Fresh Lemonade",
    description: "Chilled, tangy, refreshing.",
    price: 79,
    category: "drinks",
    image: "/images/drinks/lemonade.jpg",
    rating: 4.4,
    isVegetarian: true,
    prepTimeMinutes: 5,
  },
];

async function main() {
  for (const item of FOOD_ITEMS) {
    await prisma.foodItem.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
  console.log(`Seeded ${FOOD_ITEMS.length} menu items.`);

  const adminEmail = "admin@ticket.app";
  const adminPassword = "admin123"; // change after first login in a real deployment
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 10),
      role: "admin",
    },
  });
  console.log(`Seeded admin account: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
