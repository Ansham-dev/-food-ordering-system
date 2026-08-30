import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

interface IncomingCartItem {
  foodItemId: string;
  quantity: number;
  notes?: string;
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "Sign in to place an order." },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => null);
  const items: IncomingCartItem[] = body?.items ?? [];
  const deliveryAddress = body?.deliveryAddress?.trim();
  const customerName = body?.customerName?.trim();
  const customerPhone = body?.customerPhone?.trim();
  const paymentMethod = body?.paymentMethod;

  if (!items.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }
  if (!deliveryAddress || !customerName || !customerPhone) {
    return NextResponse.json(
      { error: "Name, phone, and delivery address are required." },
      { status: 400 }
    );
  }
  if (!["card", "cash", "upi"].includes(paymentMethod)) {
    return NextResponse.json(
      { error: "Invalid payment method." },
      { status: 400 }
    );
  }

  // Look up real, current prices server-side rather than trusting the
  // client — prevents a tampered request from placing a $0 order.
  const foodItems = await prisma.foodItem.findMany({
    where: { id: { in: items.map((i) => i.foodItemId) } },
  });

  if (foodItems.length !== new Set(items.map((i) => i.foodItemId)).size) {
    return NextResponse.json(
      { error: "One or more items in your cart no longer exist." },
      { status: 400 }
    );
  }

  const total = items.reduce((sum, ci) => {
    const food = foodItems.find((f) => f.id === ci.foodItemId)!;
    return sum + food.price * ci.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: "confirmed",
      total,
      deliveryAddress,
      customerName,
      customerPhone,
      paymentMethod,
      items: {
        create: items.map((ci) => {
          const food = foodItems.find((f) => f.id === ci.foodItemId)!;
          return {
            foodItemId: food.id,
            name: food.name,
            price: food.price,
            quantity: ci.quantity,
            notes: ci.notes,
          };
        }),
      },
    },
    include: { items: true },
  });

  return NextResponse.json(order, { status: 201 });
}
