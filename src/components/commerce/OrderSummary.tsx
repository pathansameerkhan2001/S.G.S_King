import type { ReactNode } from "react";

import { commerce } from "@/content/commerce";
import type { CartSummary } from "@/lib/cart/store";
import { formatPrice } from "@/lib/format";

/** Price breakdown shared by cart, checkout and the order request page. */
export function OrderSummary({ summary, children, title = "Order Summary" }: { summary: CartSummary; children?: ReactNode; title?: string }) {
  return (
    <section aria-labelledby="order-summary-heading" className="rounded-2xl border border-gold/35 bg-ivory p-5 shadow-[0_14px_36px_-26px_rgba(53,23,15,0.55)] sm:p-6">
      <h2 id="order-summary-heading" className="font-display text-[1.5rem] font-bold text-burgundy">
        {title}
      </h2>
      <dl className="mt-4 space-y-2.5 font-sans text-[0.92rem]">
        <div className="flex justify-between">
          <dt className="text-umber">
            Subtotal ({summary.itemCount} {summary.itemCount === 1 ? "item" : "items"})
          </dt>
          <dd className="font-semibold">{formatPrice(summary.subtotal)}</dd>
        </div>
        {summary.savings > 0 && (
          <div className="flex justify-between text-[#2f7a3d]">
            <dt>You save (vs. original price)</dt>
            <dd className="font-semibold">−{formatPrice(summary.savings)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-umber">Delivery</dt>
          <dd className="font-semibold">
            {summary.delivery === null ? "To be confirmed" : summary.delivery === 0 ? "Free" : formatPrice(summary.delivery)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-gold/30 pt-3">
          <dt className="font-display text-[1.2rem] font-bold text-ink">Total</dt>
          <dd className="font-display text-[1.6rem] font-bold text-burgundy">{formatPrice(summary.total)}</dd>
        </div>
      </dl>
      {summary.delivery === null && <p className="mt-2 font-sans text-xs text-umber">{commerce.deliveryNote}</p>}
      {children && <div className="mt-5">{children}</div>}
    </section>
  );
}
