import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  const [foodItems, orders] = await Promise.all([
    prisma.foodItem.findMany({ orderBy: { name: "asc" } }),
    prisma.order.findMany({
      include: { items: true, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <span className="font-mono text-xs uppercase tracking-widest text-chili">
        Admin
      </span>
      <h1 className="mb-6 mt-1 font-display text-2xl text-ink">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Menu items" value={String(foodItems.length)} />
        <StatCard label="Total orders" value={String(orders.length)} />
        <StatCard label="Revenue" value={formatCurrency(revenue)} />
      </div>

      <h2 className="mb-3 font-display text-lg text-ink">Menu items</h2>
      <div className="overflow-x-auto border border-ink/15 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/15 bg-paper font-mono text-xs uppercase tracking-widest text-ink/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {foodItems.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3 capitalize text-ink/50">{item.category}</td>
                <td className="price-tag px-4 py-3">{formatCurrency(item.price)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 font-mono text-xs uppercase tracking-widest ${
                      item.isAvailable
                        ? "bg-olive/10 text-olive"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Sold out"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-3 mt-8 font-display text-lg text-ink">Recent orders</h2>
      <div className="overflow-x-auto border border-ink/15 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/15 bg-paper font-mono text-xs uppercase tracking-widest text-ink/50">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center font-mono text-ink/40">
                  No orders placed yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-medium">
                    #{order.id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    {order.user?.name ?? order.customerName}
                  </td>
                  <td className="px-4 py-3 capitalize text-ink/50">
                    {order.status.replace(/-/g, " ")}
                  </td>
                  <td className="price-tag px-4 py-3">{formatCurrency(order.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-ink/15 bg-white p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-ink/50">{label}</p>
      <p className="mt-1 font-display text-2xl text-ink">{value}</p>
    </div>
  );
}
