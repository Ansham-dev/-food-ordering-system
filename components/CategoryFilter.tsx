"use client";

import { CATEGORIES } from "@/lib/data";
import { FoodCategory } from "@/types";
import { classNames } from "@/lib/utils";

interface Props {
  active: FoodCategory | "all";
  onChange: (category: FoodCategory | "all") => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-ink/10 pb-0">
      <button
        onClick={() => onChange("all")}
        className={classNames(
          "shrink-0 border-b-2 px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors",
          active === "all"
            ? "border-chili text-ink"
            : "border-transparent text-ink/40 hover:text-ink/70"
        )}
      >
        All
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={classNames(
            "shrink-0 border-b-2 px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors",
            active === cat.id
              ? "border-chili text-ink"
              : "border-transparent text-ink/40 hover:text-ink/70"
          )}
        >
          {cat.emoji} {cat.label}
        </button>
      ))}
    </div>
  );
}
