export type FoodCategory =
  | "pizza"
  | "burgers"
  | "asian"
  | "desserts"
  | "drinks";

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  image: string;
  rating: number;
  isAvailable: boolean;
  isPopular?: boolean;
  isVegetarian?: boolean;
  prepTimeMinutes: number;
}

export interface CartItem {
  item: FoodItem;
  quantity: number;
  notes?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out-for-delivery"
  | "delivered"
  | "cancelled";

/** A line item as stored on a placed order (snapshot of name/price at order time). */
export interface OrderLineItem {
  id: string;
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string | null;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderLineItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: "card" | "cash" | "upi";
  user?: { name: string; email: string };
}

export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  address?: string;
}
