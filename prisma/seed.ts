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
    image: "/images/pizza/margherita.svg",
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
    image: "/images/pizza/pepperoni.svg",
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
    image: "/images/burgers/cheeseburger.svg",
    rating: 4.5,
    prepTimeMinutes: 15,
  },
  {
    id: "bg-2",
    name: "Crispy Veg Burger",
    description: "Crispy veg patty, mayo, pickles.",
    price: 159,
    category: "burgers",
    image: "/images/burgers/veg-burger.svg",
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
    image: "/images/asian/ramen.svg",
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
    image: "/images/asian/fried-rice.svg",
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
    image: "/images/desserts/molten-cake.svg",
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
    image: "/images/drinks/lemonade.svg",
    rating: 4.4,
    isVegetarian: true,
    prepTimeMinutes: 5,
  },
  {
    id: "pz-3",
    name: "BBQ Chicken Pizza",
    description: "Smoky BBQ sauce, grilled chicken, red onion.",
    price: 349,
    category: "pizza",
    image: "/images/pizza/bbq-chicken.svg",
    rating: 4.6,
    prepTimeMinutes: 22,
  },
  {
    id: "pz-4",
    name: "Veggie Supreme Pizza",
    description: "Bell peppers, olives, mushroom, sweet corn.",
    price: 289,
    category: "pizza",
    image: "/images/pizza/veggie-supreme.svg",
    rating: 4.4,
    isVegetarian: true,
    prepTimeMinutes: 20,
  },
  {
    id: "bg-3",
    name: "Double Bacon Burger",
    description: "Two patties, crispy bacon, cheddar, BBQ mayo.",
    price: 269,
    category: "burgers",
    image: "/images/burgers/double-bacon.svg",
    rating: 4.7,
    isPopular: true,
    prepTimeMinutes: 18,
  },
  {
    id: "bg-4",
    name: "Grilled Chicken Burger",
    description: "Flame-grilled chicken breast, lettuce, chipotle sauce.",
    price: 219,
    category: "burgers",
    image: "/images/burgers/grilled-chicken.svg",
    rating: 4.5,
    prepTimeMinutes: 16,
  },
  {
    id: "as-3",
    name: "Pad Thai",
    description: "Stir-fried rice noodles, peanuts, tangy tamarind sauce.",
    price: 249,
    category: "asian",
    image: "/images/asian/pad-thai.svg",
    rating: 4.6,
    prepTimeMinutes: 20,
  },
  {
    id: "as-4",
    name: "Vegetable Spring Rolls",
    description: "Crispy rolls, shredded veggies, sweet chili dip.",
    price: 139,
    category: "asian",
    image: "/images/asian/spring-rolls.svg",
    rating: 4.3,
    isVegetarian: true,
    prepTimeMinutes: 12,
  },
  {
    id: "as-5",
    name: "Chicken Manchurian",
    description: "Indo-Chinese chicken tossed in a spicy soy glaze.",
    price: 259,
    category: "asian",
    image: "/images/asian/manchurian.svg",
    rating: 4.5,
    prepTimeMinutes: 22,
  },
  {
    id: "ds-2",
    name: "New York Cheesecake",
    description: "Creamy baked cheesecake, berry compote.",
    price: 179,
    category: "desserts",
    image: "/images/desserts/cheesecake.svg",
    rating: 4.7,
    isVegetarian: true,
    prepTimeMinutes: 8,
  },
  {
    id: "ds-3",
    name: "Tiramisu",
    description: "Coffee-soaked layers, mascarpone, cocoa dust.",
    price: 199,
    category: "desserts",
    image: "/images/desserts/tiramisu.svg",
    rating: 4.8,
    isVegetarian: true,
    prepTimeMinutes: 8,
  },
  {
    id: "dr-2",
    name: "Iced Cold Coffee",
    description: "Bold cold brew, milk, a touch of sweetness.",
    price: 109,
    category: "drinks",
    image: "/images/drinks/iced-coffee.svg",
    rating: 4.5,
    isVegetarian: true,
    prepTimeMinutes: 5,
  },
  {
    id: "dr-3",
    name: "Mango Smoothie",
    description: "Ripe mango blended thick and creamy.",
    price: 119,
    category: "drinks",
    image: "/images/drinks/mango-smoothie.svg",
    rating: 4.6,
    isPopular: true,
    isVegetarian: true,
    prepTimeMinutes: 6,
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