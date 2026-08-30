"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartItem } from "@/types";
import { loadCart, saveCart, cartTotal, formatCurrency } from "@/lib/utils";
import Button from "./Button";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (open) setItems(loadCart());
  }, [open]);

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-lg font-semibold">Your cart</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-neutral-500">Your cart is empty.</p>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto">
            {items.map((ci) => (
              <div key={ci.item.id} className="flex items-center gap-3">
                <img
                  src={ci.item.image}
                  alt={ci.item.name}
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{ci.item.name}</p>
                  <p className="text-xs text-neutral-500">
                    {formatCurrency(ci.item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="h-7 w-7 rounded-full bg-neutral-100 text-sm"
                    onClick={() => updateQuantity(ci.item.id, -1)}
                  >
                    −
                  </button>
                  <span className="w-4 text-center text-sm">{ci.quantity}</span>
                  <button
                    className="h-7 w-7 rounded-full bg-neutral-100 text-sm"
                    onClick={() => updateQuantity(ci.item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 border-t border-neutral-200 pt-4">
          <div className="mb-3 flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(cartTotal(items))}</span>
          </div>
          <Link href="/checkout" className="block" onClick={onClose}>
            <Button className="w-full" disabled={items.length === 0}>
              Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
