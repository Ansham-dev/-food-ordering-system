"use client";

import { useState } from "react";
import { FoodItem, CartItem } from "@/types";
import { formatCurrency, loadCart, saveCart } from "@/lib/utils";
import Button from "./Button";

function notifyCartUpdated() {
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item: FoodItem, quantity = 1) {
  const cart = loadCart();
  const existing = cart.find((ci) => ci.item.id === item.id);
  let next: CartItem[];
  if (existing) {
    next = cart.map((ci) =>
      ci.item.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci
    );
  } else {
    next = [...cart, { item, quantity }];
  }
  saveCart(next);
  notifyCartUpdated();
}

export default function FoodCard({ item }: { item: FoodItem }) {
  const [added, setAdded] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function handleConfirm() {
    addToCart(item);
    setConfirming(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="ticket group flex flex-col overflow-hidden transition-transform hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover grayscale-[15%] transition-transform group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {item.isPopular && (
          <span className="absolute left-0 top-3 bg-chili px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white">
            No. 1 seller
          </span>
        )}
        {item.isVegetarian && (
          <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-olive bg-cream text-[10px] font-bold text-olive">
            V
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-sm leading-tight text-ink">
            {item.name}
          </h3>
          <span className="whitespace-nowrap font-mono text-xs text-mustard">
            {item.rating.toFixed(1)}★
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-ink/55">{item.description}</p>

        <div className="ticket-tear mt-3 flex items-center justify-between pt-3">
          <span className="price-tag text-base font-semibold text-ink">
            {formatCurrency(item.price)}
          </span>
          <Button
            size="sm"
            disabled={!item.isAvailable}
            onClick={() => setConfirming(true)}
            className={added ? "!bg-olive" : ""}
          >
            {!item.isAvailable ? "Sold out" : added ? "Added ✓" : "Add +"}
          </Button>
        </div>
      </div>

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
          onClick={() => setConfirming(false)}
        >
          <div
            className="w-full max-w-sm border-2 border-ink bg-cream p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-ink/50">
              Confirm order
            </p>
            <h3 className="mb-3 font-display text-lg text-ink">
              Add {item.name} to your cart?
            </h3>
            <div className="mb-4 flex items-center justify-between border-t border-ink/10 pt-3">
              <span className="text-sm text-ink/60">Price</span>
              <span className="price-tag text-base font-semibold text-ink">
                {formatCurrency(item.price)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 border border-ink/20 py-2 font-mono text-xs uppercase tracking-widest text-ink/70 hover:border-ink/40"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-ink py-2 font-mono text-xs uppercase tracking-widest text-cream hover:bg-chili"
              >
                Yes, add it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
