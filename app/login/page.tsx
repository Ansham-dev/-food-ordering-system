"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "signup" && !name.trim()) {
      setError("Enter your name.");
      return;
    }
    if (!email || !password) {
      setError("Enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "signup"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      router.push("/profile");
      router.refresh();
    } catch {
      setError("Network error — is the dev server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <div className="w-full border border-ink/15 bg-white p-8">
        <div className="mb-6 flex border-b border-ink/10 font-mono text-xs uppercase tracking-widest">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`border-b-2 px-3 py-2 ${
              mode === "login" ? "border-chili text-ink" : "border-transparent text-ink/40"
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`border-b-2 px-3 py-2 ${
              mode === "signup" ? "border-chili text-ink" : "border-transparent text-ink/40"
            }`}
          >
            Create account
          </button>
        </div>

        <h1 className="mb-1 font-display text-2xl text-ink">
          {mode === "login" ? "Welcome back" : "Join Ticket"}
        </h1>
        <p className="mb-6 text-sm text-ink/50">
          {mode === "login"
            ? "Sign in to track orders and save your details."
            : "Create an account to place orders."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-xs font-mono uppercase tracking-widest text-ink/60">
                Full name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-ink/20 px-3 py-2 text-sm outline-none focus:border-chili"
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-mono uppercase tracking-widest text-ink/60">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-ink/20 px-3 py-2 text-sm outline-none focus:border-chili"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-mono uppercase tracking-widest text-ink/60">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-ink/20 px-3 py-2 text-sm outline-none focus:border-chili"
            />
          </div>
          {error && <p className="text-sm text-chili">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-ink/40">
          Demo admin: admin@ticket.app / admin123
        </p>
      </div>
    </div>
  );
}
