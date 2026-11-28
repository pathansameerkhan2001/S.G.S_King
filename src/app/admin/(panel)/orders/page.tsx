import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AdminLoading, AdminPageHeader, Badge, EmptyState, ErrorState, formatDate, formatInr, matchesQ, TableWrap, td, th } from "@/components/admin/ui";
import { paymentTone, statusTone } from "@/components/admin/orderTones";
import { orderStatuses, paymentStatuses } from "@/lib/admin/schemas";
import { requireAdmin } from "@/lib/server/auth";
import { load } from "@/lib/server/load";
import { listOrders } from "@/lib/server/repo/catalog";

export const metadata: Metadata = { title: "Orders" };

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

async function OrdersContent({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin("/admin/orders");
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const status = typeof params.status === "string" ? params.status : "";
  const payment = typeof params.payment === "string" ? params.payment : "";
  const res = await load(listOrders);
  if (!res.ok) return <ErrorState {...res} />;
  const orders = res.data;
  const rows = orders.filter(
    (o) => matchesQ(q, o.orderId, o.customer.name, o.customer.phone) && (!status || o.status === status) && (!payment || o.payment.status === payment),
  );

  return (
    <>
      <form className="mb-4 flex flex-wrap items-end gap-2" role="search" aria-label="Filter orders">
        {q && <input type="hidden" name="q" value={q} />}
        <label className="font-sans text-xs font-semibold text-umber">
          Order status
          <select name="status" defaultValue={status} className="mt-1 block h-10 rounded-xl border border-gold/45 bg-ivory px-3 text-sm">
            <option value="">All</option>
            {orderStatuses.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
          </select>
        </label>
        <label className="font-sans text-xs font-semibold text-umber">
          Payment
          <select name="payment" defaultValue={payment} className="mt-1 block h-10 rounded-xl border border-gold/45 bg-ivory px-3 text-sm">
            <option value="">All</option>
            {paymentStatuses.map((s) => <option key={s} value={s}>{cap(s)}</option>)}
          </select>
        </label>
        <button type="submit" className="h-10 rounded-xl border border-gold/50 px-4 font-sans text-sm font-semibold text-burgundy hover:bg-gold-pale">Apply</button>
        <p role="status" className="ml-auto font-sans text-sm text-umber">{rows.length} of {orders.length} orders</p>
      </form>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          text="Orders appear here once the storefront checkout is connected to the orders backend. Current storefront checkout sends order requests via WhatsApp/email and does not create records."
        />
      ) : rows.length === 0 ? (
        <EmptyState title="No orders match" text="Try a different search or filter." />
      ) : (
        <TableWrap label="Orders">
          <thead>
            <tr>
              <th scope="col" className={th}>Order</th>
              <th scope="col" className={th}>Date</th>
              <th scope="col" className={th}>Customer</th>
              <th scope="col" className={th}>Total</th>
              <th scope="col" className={th}>Status</th>
              <th scope="col" className={th}>Payment</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.orderId} className="hover:bg-cream/40">
                <td className={td}>
                  <Link href={`/admin/orders/${encodeURIComponent(o.orderId)}`} className="font-mono text-xs font-semibold text-burgundy hover:underline">{o.orderId}</Link>
                </td>
                <td className={`${td} whitespace-nowrap text-xs`}>{formatDate(o.createdAt)}</td>
                <td className={td}>{o.customer.name}<div className="text-xs text-umber">{o.shipping.city}</div></td>
                <td className={td}>{formatInr(o.totals.total)}</td>
                <td className={td}><Badge tone={statusTone(o.status)}>{cap(o.status)}</Badge></td>
                <td className={td}><Badge tone={paymentTone(o.payment.status)}>{o.payment.method.toUpperCase()} · {cap(o.payment.status)}</Badge></td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </>
  );
}

export default function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  return (
    <>
      <AdminPageHeader title="Orders" description="Track orders, payments and deliveries." crumbs={[{ label: "Orders" }]} />
      <Suspense fallback={<AdminLoading label="Loading orders" />}>
        <OrdersContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
