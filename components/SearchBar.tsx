"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search for dishes..."}
        className="w-full border border-ink/15 bg-white py-3 pl-11 pr-4 text-sm text-ink outline-none placeholder:text-ink/35 focus:border-chili"
      />
    </div>
  );
}
