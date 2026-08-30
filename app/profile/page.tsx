"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => data && setUser(data))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          address: user.address,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return null;
  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="mb-4 text-ink/50">Sign in to view your profile.</p>
        <Link href="/login">
          <Button>Sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl text-ink">My profile</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 border border-ink/15 bg-white p-6"
      >
        <div>
          <label className="mb-1 block text-xs font-mono uppercase tracking-widest text-ink/60">
            Full name
          </label>
          <input
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full border border-ink/20 px-3 py-2 text-sm outline-none focus:border-chili"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-mono uppercase tracking-widest text-ink/60">
            Email
          </label>
          <input
            value={user.email}
            disabled
            className="w-full border border-ink/10 bg-paper/50 px-3 py-2 text-sm text-ink/50 outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-mono uppercase tracking-widest text-ink/60">
            Phone
          </label>
          <input
            value={user.phone ?? ""}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            className="w-full border border-ink/20 px-3 py-2 text-sm outline-none focus:border-chili"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-mono uppercase tracking-widest text-ink/60">
            Delivery address
          </label>
          <textarea
            rows={3}
            value={user.address ?? ""}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            className="w-full border border-ink/20 px-3 py-2 text-sm outline-none focus:border-chili"
          />
        </div>

        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
