import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { paymentTone, statusTone } from "@/components/admin/orderTones";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { AdminLoading, AdminPageHeader, Badge, Card, ErrorState, formatDate, formatInr } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/server/auth";
import { load } from "@/lib/server/load";
import { getOrder } from "@/lib/server/repo/catalog";

import { saveOrderStatus } from "../actions";

export const metadata: Metadata = { title: "Order" };

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw);
  await requireAdmin(`/admin/orders/${raw}`);
  if (!/^[A-Za-z0-9_-]{4,60}$/.test(id)) notFound();
  const res = await load(() => getOrder(id));
  if (!res.ok) return <ErrorState {...res} />;
  const order = res.data;
  if (!order) notFound();
  const s = order.shipping;

  return (
    <>
      <AdminPageHeader title={`Order ${order.orderId}`} description={`Placed ${formatDate(order.createdAt)}`} crumbs={[{ label: "Orders", href: "/admin/orders" }, { label: order.orderId }]} />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <Card>
            <div className="flex flex-wrap gap-2">
              <Badge tone={statusTone(order.status)}>{cap(order.status)}</Badge>
              <Badge tone={paymentTone(order.payment.status)}>{order.payment.method === "cod" ? "Cash on Delivery" : "Online"} · {cap(order.payment.status)}</Badge>
              {order.couponCode && <Badge tone="info">Coupon {order.couponCode}</Badge>}
            </div>
            <h2 className="mt-4 font-display text-[1.3rem] font-bold text-burgundy">Items</h2>
            <ul className="mt-2 divide-y divide-gold/20 font-sans text-sm">
              {order.items.map((i, n) => (
                <li key={n} className="flex justify-between gap-3 py-2">
                  <span>{i.name}{i.variant && <span className="text-umber"> ({i.variant})</span>} × {i.quantity} <span className="text-xs text-umber">@ {formatInr(i.unitPrice)}</span></span>
                  <span className="font-semibold">{formatInr(i.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 border-t border-gold/25 pt-3 font-sans text-sm">
              <div className="flex justify-between"><dt className="text-umber">Subtotal</dt><dd>{formatInr(order.totals.subtotal)}</dd></div>
              {order.totals.discount > 0 && <div className="flex justify-between"><dt className="text-umber">Discount</dt><dd>−{formatInr(order.totals.discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-umber">Delivery</dt><dd>{formatInr(order.totals.delivery)}</dd></div>
              <div className="flex justify-between font-semibold"><dt>Total</dt><dd>{formatInr(order.totals.total)}</dd></div>
            </dl>
            <p className="mt-2 font-sans text-xs text-umber">Prices are a snapshot taken when the order was placed.</p>
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            <Card>
              <h2 className="font-display text-[1.3rem] font-bold text-burgundy">Customer</h2>
              <p className="mt-2 font-sans text-sm">{order.customer.name}</p>
              <p className="font-sans text-sm"><a href={`tel:+91${order.customer.phone}`} className="text-burgundy hover:underline">{order.customer.phone}</a></p>
              {order.customer.email && <p className="break-all font-sans text-sm">{order.customer.email}</p>}
            </Card>
            <Card>
              <h2 className="font-display text-[1.3rem] font-bold text-burgundy">Delivery address</h2>
              <address className="mt-2 font-sans text-sm not-italic leading-relaxed">
                {s.house}, {s.street}<br />{s.area}{s.landmark && `, near ${s.landmark}`}<br />{s.city}, {s.state} – {s.pincode}
              </address>
              {s.addressType && <p className="mt-1 font-sans text-xs capitalize text-umber">{s.addressType}</p>}
            </Card>
          </div>

          <Card>
            <h2 className="font-display text-[1.3rem] font-bold text-burgundy">Timeline</h2>
            {order.timeline?.length ? (
              <ol className="mt-3 space-y-3 border-l-2 border-gold/40 pl-4">
                {[...order.timeline].reverse().map((t, n) => (
                  <li key={n} className="font-sans text-sm">
                    <p className="text-xs text-umber">{formatDate(t.at)}{t.by && ` · ${t.by}`}</p>
                    <p>
                      {t.status && <>Status → <strong>{cap(t.status)}</strong>. </>}
                      {t.payment && <>Payment → <strong>{cap(t.payment)}</strong>. </>}
                      {t.note}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 font-sans text-sm text-umber">No updates yet.</p>
            )}
          </Card>
        </div>
        <Card className="h-fit xl:sticky xl:top-24">
          <h2 className="mb-3 font-display text-[1.3rem] font-bold text-burgundy">Update order</h2>
          <OrderStatusForm order={order} action={saveOrderStatus} />
          {order.notes && <p className="mt-4 rounded-xl bg-gold-pale/60 p-3 font-sans text-sm"><strong>Customer note:</strong> {order.notes}</p>}
        </Card>
      </div>
    </>
  );
}

export default function OrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  return (
    <Suspense fallback={<AdminLoading label="Loading order" />}>
      <Content params={params} />
    </Suspense>
  );
}
