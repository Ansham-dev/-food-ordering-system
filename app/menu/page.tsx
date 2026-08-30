"use client";

import { useEffect, useMemo, useState } from "react";
import { FoodItem, FoodCategory } from "@/types";
import FoodCard from "@/components/FoodCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";

export default function MenuPage() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState<FoodCategory | "all">("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load menu.");
        return res.json();
      })
      .then(setItems)
      .catch(() => setError("Couldn't load the menu. Is the database set up? Run `npm run db:reset`."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesQuery = item.name
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [items, category, query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <span className="font-mono text-xs uppercase tracking-widest text-chili">
        Full menu
      </span>
      <h1 className="mb-6 mt-1 font-display text-3xl text-ink">
        What are you craving?
      </h1>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="sm:w-80">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <CategoryFilter active={category} onChange={setCategory} />
      </div>

      {loading ? (
        <p className="py-16 text-center font-mono text-sm text-ink/40">
          Loading menu...
        </p>
      ) : error ? (
        <p className="py-16 text-center font-mono text-sm text-chili">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center font-mono text-sm text-ink/40">
          No dishes match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
