import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink text-cream/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 font-mono text-xs uppercase tracking-widest sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Ticket — kitchen&apos;s closed at midnight</p>
        <div className="flex gap-5">
          <Link href="/menu" className="hover:text-chili">
            Menu
          </Link>
          <Link href="/orders" className="hover:text-chili">
            Orders
          </Link>
          <Link href="/profile" className="hover:text-chili">
            Profile
          </Link>
        </div>
      </div>
    </footer>
  );
}
