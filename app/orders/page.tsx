import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";
import { OrderStatus } from "@/types";
import OrderTracker from "@/components/OrderTracker";
import Button from "@/components/Button";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl text-ink">Your orders</h1>

      {orders.length === 0 ? (
        <div className="border border-dashed border-ink/20 py-16 text-center">
          <p className="mb-4 font-mono text-sm text-ink/50">
            You haven&apos;t placed any orders yet.
          </p>
          <Link href="/menu">
            <Button>Browse menu</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="ticket p-5">
              <div className="ticket-tear mb-4 flex items-center justify-between pb-4">
                <div>
                  <p className="font-display text-sm text-ink">
                    Order #{order.id.slice(-6).toUpperCase()}
                  </p>
                  <p className="font-mono text-xs text-ink/50">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className="price-tag font-semibold">
                  {formatCurrency(order.total)}
                </span>
              </div>

              <OrderTracker status={order.status as OrderStatus} />

              <div className="ticket-tear mt-5 space-y-1 pt-4 text-sm text-ink/70">
                {order.items.map((li) => (
                  <div key={li.id} className="flex justify-between">
                    <span>
                      {li.name} × {li.quantity}
                    </span>
                    <span className="price-tag">
                      {formatCurrency(li.price * li.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
