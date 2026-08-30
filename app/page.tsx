import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import FoodCard from "@/components/FoodCard";
import Button from "@/components/Button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const popular = await prisma.foodItem.findMany({
    where: { isPopular: true },
    orderBy: { rating: "desc" },
  });
  const today = new Date();
  const previewItems = popular.slice(0, 3);

  return (
    <div>
      <section className="grain-bg overflow-hidden border-b-2 border-ink bg-ink text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:grid-cols-[1.1fr_0.9fr] sm:items-center">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-mustard">
              Now taking orders
            </span>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
              Order&nbsp;up.
              <br />
              Eat&nbsp;well.
            </h1>
            <p className="mt-5 max-w-md text-cream/60">
              Pizza, burgers, Asian favorites, desserts, and drinks — fired,
              plated, and out the door.
            </p>
            <Link href="/menu" className="mt-8 inline-block">
              <Button size="lg">View the menu</Button>
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-xs -rotate-2 bg-cream p-5 text-ink shadow-[8px_8px_0_0_rgba(255,68,38,0.35)]">
            <div className="ticket-tear flex items-center justify-between pb-2 font-mono text-[11px] uppercase tracking-widest text-ink/50">
              <span>Ticket #0192</span>
              <span>
                {today.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>
            <div className="space-y-2 py-4">
              {previewItems.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 text-sm">
                  <span className="font-mono">{item.name}</span>
                  <span className="price-tag text-ink/70">
                    {formatCurrency(item.price)}
                  </span>
                </div>
              ))}
            </div>
            <div className="ticket-tear flex justify-between pt-3 font-mono text-sm font-bold">
              <span>Total</span>
              <span className="price-tag">
                {formatCurrency(previewItems.reduce((s, i) => s + i.price, 0))}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between border-b border-ink/10 pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-chili">
              Chef&rsquo;s picks
            </span>
            <h2 className="mt-1 font-display text-2xl text-ink">
              Popular right now
            </h2>
          </div>
          <Link
            href="/menu"
            className="font-mono text-xs uppercase tracking-widest text-ink/60 hover:text-chili"
          >
            Full menu →
          </Link>
        </div>
        {popular.length === 0 ? (
          <p className="font-mono text-sm text-ink/40">
            No dishes yet — run <code>npm run db:reset</code> to seed the menu.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
