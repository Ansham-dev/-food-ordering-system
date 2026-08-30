"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartItem } from "@/types";
import { loadCart, saveCart, cartTotal, formatCurrency } from "@/lib/utils";
import Button from "@/components/Button";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setLoaded(true);
  }, []);

  function updateQuantity(id: string, delta: number) {
    const next = items
      .map((ci) =>
        ci.item.id === id
          ? { ...ci, quantity: Math.max(0, ci.quantity + delta) }
          : ci
      )
      .filter((ci) => ci.quantity > 0);
    setItems(next);
    saveCart(next);
    window.dispatchEvent(new Event("cart-updated"));
  }

  function removeItem(id: string) {
    const next = items.filter((ci) => ci.item.id !== id);
    setItems(next);
    saveCart(next);
    window.dispatchEvent(new Event("cart-updated"));
  }

  if (!loaded) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Your cart</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center">
          <p className="mb-4 text-neutral-500">Your cart is empty.</p>
          <Link href="/menu">
            <Button>Browse menu</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
            {items.map((ci) => (
              <div key={ci.item.id} className="flex items-center gap-4 p-4">
                <img
                  src={ci.item.image}
                  alt={ci.item.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{ci.item.name}</p>
                  <p className="text-sm text-neutral-500">
                    {formatCurrency(ci.item.price)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="h-8 w-8 rounded-full bg-neutral-100"
                    onClick={() => updateQuantity(ci.item.id, -1)}
                  >
                    −
                  </button>
                  <span className="w-5 text-center">{ci.quantity}</span>
                  <button
                    className="h-8 w-8 rounded-full bg-neutral-100"
                    onClick={() => updateQuantity(ci.item.id, 1)}
                  >
                    +
                  </button>
                </div>
                <p className="w-20 text-right font-semibold">
                  {formatCurrency(ci.item.price * ci.quantity)}
                </p>
                <button
                  className="text-neutral-400 hover:text-red-500"
                  onClick={() => removeItem(ci.item.id)}
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold">
              {formatCurrency(cartTotal(items))}
            </span>
          </div>

          <Link href="/checkout" className="mt-6 block">
            <Button size="lg" className="w-full">
              Proceed to checkout
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
