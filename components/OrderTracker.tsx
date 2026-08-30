import { OrderStatus } from "@/types";
import { classNames } from "@/lib/utils";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "out-for-delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

export default function OrderTracker({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
        Order cancelled
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={classNames(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                  done ? "bg-brand text-white" : "bg-neutral-200 text-neutral-500"
                )}
              >
                {done ? "✓" : i + 1}
              </div>
              <span className="w-20 text-center text-[11px] text-neutral-500">
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={classNames(
                  "mx-1 h-0.5 flex-1",
                  i < currentIndex ? "bg-brand" : "bg-neutral-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
