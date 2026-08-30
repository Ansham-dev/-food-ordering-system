"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CartItem } from "@/types";
import { loadCart, saveCart, cartTotal, formatCurrency } from "@/lib/utils";
import Button from "@/components/Button";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    payment: "card" as "card" | "cash" | "upi",
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(loadCart());
    fetch("/api/auth/me")
      .then((res) => {
        setSignedIn(res.ok);
        return res.ok ? res.json() : null;
      })
      .then((user) => {
        if (user) {
          setForm((f) => ({ ...f, name: user.name, phone: user.phone ?? "", address: user.address ?? "" }));
        }
      })
      .finally(() => setCheckingAuth(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((ci) => ({
            foodItemId: ci.item.id,
            quantity: ci.quantity,
            notes: ci.notes,
          })),
          deliveryAddress: form.address,
          customerName: form.name,
          customerPhone: form.phone,
          paymentMethod: form.payment,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't place the order.");
        return;
      }
      saveCart([]);
      window.dispatchEvent(new Event("cart-updated"));
      router.push("/orders");
    } catch {
      setError("Network error — is the dev server running?");
    } finally {
      setPlacing(false);
    }
  }

  const total = cartTotal(items);

  if (checkingAuth) return null;

  if (!signedIn) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="mb-3 font-display text-2xl text-ink">Sign in to check out</h1>
        <p className="mb-6 text-sm text-ink/50">
          Your cart is saved — sign in or create an account to place the order.
        </p>
        <Link href="/login">
          <Button>Sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl text-ink">Checkout</h1>

      {items.length === 0 ? (
        <p className="text-ink/50">Your cart is empty.</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-mono uppercase tracking-widest text-ink/60">
                Full name
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-ink/20 px-3 py-2 text-sm outline-none focus:border-chili"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-mono uppercase tracking-widest text-ink/60">
                Phone
              </label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-ink/20 px-3 py-2 text-sm outline-none focus:border-chili"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-mono uppercase tracking-widest text-ink/60">
                Delivery address
              </label>
              <textarea
                required
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border border-ink/20 px-3 py-2 text-sm outline-none focus:border-chili"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-mono uppercase tracking-widest text-ink/60">
                Payment method
              </label>
              <div className="flex gap-2">
                {(["card", "upi", "cash"] as const).map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setForm({ ...form, payment: method })}
                    className={`border px-4 py-2 font-mono text-xs uppercase tracking-widest ${
                      form.payment === method
                        ? "border-chili bg-chili/10 text-chili"
                        : "border-ink/20 text-ink/60"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="ticket h-fit p-5">
            <h2 className="mb-4 font-display text-sm text-ink">Order summary</h2>
            <div className="space-y-2 text-sm">
              {items.map((ci) => (
                <div key={ci.item.id} className="flex justify-between">
                  <span>
                    {ci.item.name} × {ci.quantity}
                  </span>
                  <span className="price-tag">{formatCurrency(ci.item.price * ci.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="ticket-tear mt-4 flex justify-between pt-4 font-semibold">
              <span>Total</span>
              <span className="price-tag">{formatCurrency(total)}</span>
            </div>
            {error && <p className="mt-3 text-sm text-chili">{error}</p>}
            <Button type="submit" className="mt-5 w-full" disabled={placing}>
              {placing ? "Placing order..." : "Place order"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
