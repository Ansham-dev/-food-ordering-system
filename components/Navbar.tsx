"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadCart, cartCount } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/orders", label: "Orders" },
];

interface SessionUser {
  id: string;
  name: string;
  role: string;
}

export default function Navbar() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const sync = () => setCount(cartCount(loadCart()));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("cart-updated", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cart-updated", sync as EventListener);
    };
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .finally(() => setChecked(true));
  }, []);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="" className="h-8 w-8" />
          <span className="font-display text-lg tracking-tight text-ink">
            TICKET
          </span>
        </Link>

        <div className="hidden gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-widest text-ink/60 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="font-mono text-xs uppercase tracking-widest text-ink/60 hover:text-ink"
            >
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-none border border-ink/15 bg-white px-3 py-1.5 hover:border-ink/40"
            aria-label="Cart"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-ink/70">
              Order
            </span>
            <span className="flex h-5 min-w-5 items-center justify-center bg-chili px-1 font-mono text-[11px] font-bold text-white">
              {count}
            </span>
          </Link>

          {!checked ? null : user ? (
            <button
              onClick={handleSignOut}
              className="bg-ink px-4 py-2 font-mono text-xs uppercase tracking-widest text-cream hover:bg-chili"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-ink px-4 py-2 font-mono text-xs uppercase tracking-widest text-cream hover:bg-chili"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
