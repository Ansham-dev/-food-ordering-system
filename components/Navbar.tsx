"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [count, setCount] = useState(0);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [checked, setChecked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    function fetchUser() {
      fetch("/api/auth/me")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setUser(data))
        .finally(() => setChecked(true));
    }
    fetchUser();
    window.addEventListener("auth-updated", fetchUser);
    return () => window.removeEventListener("auth-updated", fetchUser);
  }, [pathname]);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMenuOpen(false);
    window.dispatchEvent(new Event("auth-updated"));
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
              className="hidden bg-ink px-4 py-2 font-mono text-xs uppercase tracking-widest text-cream hover:bg-chili sm:block"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="hidden bg-ink px-4 py-2 font-mono text-xs uppercase tracking-widest text-cream hover:bg-chili sm:block"
            >
              Sign in
            </Link>
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center border border-ink/15 bg-white sm:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="relative flex h-3.5 w-4 flex-col justify-between">
              <span
                className={`h-[1.5px] w-full bg-ink transition-transform ${
                  menuOpen ? "translate-y-[6.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-full bg-ink transition-opacity ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-full bg-ink transition-transform ${
                  menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t-2 border-ink bg-cream px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 font-mono text-xs uppercase tracking-widest text-ink/70 hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="py-2 font-mono text-xs uppercase tracking-widest text-ink/70 hover:text-ink"
              >
                Admin
              </Link>
            )}
            {!checked ? null : user ? (
              <button
                onClick={handleSignOut}
                className="mt-2 bg-ink px-4 py-2 text-left font-mono text-xs uppercase tracking-widest text-cream hover:bg-chili"
              >
                Sign out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-2 bg-ink px-4 py-2 text-left font-mono text-xs uppercase tracking-widest text-cream hover:bg-chili"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
