import { AlertTriangle, CheckCircle2, Clock, IndianRupee, Package, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";

import { paymentTone, statusTone } from "@/components/admin/orderTones";
import { AdminLoading, AdminPageHeader, Badge, Card, EmptyState, ErrorState, formatDate, formatInr } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/server/auth";
import { missingConfig } from "@/lib/server/env";
import { load } from "@/lib/server/load";
import { listCategories, listCombos, listOrders, listProducts } from "@/lib/server/repo/catalog";

export const metadata: Metadata = { title: "Dashboard" };

const LOW_STOCK = 5;

/** Loads everything the dashboard needs (outside render). */
async function loadDashboard() {
  const [orders, products, categories, combos] = await Promise.all([listOrders(), listProducts(), listCategories(), listCombos()]);
  return { orders, products, categories, combos, since: Date.now() - 30 * 24 * 3600 * 1000 };
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Stat({ icon, label, value, hint }: { icon: ReactNode; label: string; value: string | number; hint?: string }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-gold-pale text-burgundy">{icon}</span>
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-umber">{label}</p>
          <p className="font-display text-[1.8rem] font-bold leading-none text-ink">{value}</p>
        </div>
      </div>
      {hint && <p className="mt-2 font-sans text-xs text-umber">{hint}</p>}
    </Card>
  );
}

async function DashboardContent() {
  const session = await requireAdmin("/admin");
  const missing = missingConfig();
  const res = await load(loadDashboard);

  return (
    <>
      <p className="mb-5 font-sans text-sm text-umber">Welcome back{session.name ? `, ${session.name}` : ""}.</p>
      {missing.length > 0 && <div className="mb-5"><ErrorState title="Configuration incomplete" text="Some server settings are missing:" details={missing} /></div>}
      {!res.ok ? (
        <ErrorState {...res} />
      ) : (
        (() => {
          const { orders, products, categories, combos, since } = res.data;
          const live = orders.filter((o) => o.status !== "cancelled");
          const pending = orders.filter((o) => o.status === "pending" || o.status === "confirmed").length;
          const completed = orders.filter((o) => o.status === "delivered").length;
          const revenue = live.reduce((n, o) => n + o.totals.total, 0);
          const last30 = live.filter((o) => new Date(o.createdAt).getTime() >= since);
          const lowStock = products.flatMap((p) => {
            const tracked = p.variants.filter((v) => typeof v.stock === "number" && v.stock <= LOW_STOCK).map((v) => ({ p, label: `${v.label}: ${v.stock} left` }));
            if (tracked.length) return tracked;
            return p.availability !== "in_stock" ? [{ p, label: p.availability === "out_of_stock" ? "Out of stock" : "Marked low stock" }] : [];
          });
          return (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Stat icon={<ShoppingBag aria-hidden="true" className="size-5" />} label="Total orders" value={orders.length} />
                <Stat icon={<Clock aria-hidden="true" className="size-5" />} label="Pending" value={pending} hint="Pending + confirmed" />
                <Stat icon={<CheckCircle2 aria-hidden="true" className="size-5" />} label="Completed" value={completed} hint="Delivered" />
                <Stat icon={<IndianRupee aria-hidden="true" className="size-5" />} label="Sales" value={formatInr(revenue)} hint={`Last 30 days: ${formatInr(last30.reduce((n, o) => n + o.totals.total, 0))} · ${last30.length} orders (excl. cancelled)`} />
              </div>

              <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
                <Card>
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-display text-[1.3rem] font-bold text-burgundy">Recent orders</h2>
                    <Link href="/admin/orders" className="font-sans text-sm font-semibold text-burgundy hover:underline">View all</Link>
                  </div>
                  {orders.length === 0 ? (
                    <EmptyState title="No orders yet" text="Orders will appear once the storefront checkout is connected to the orders backend." />
                  ) : (
                    <ul className="divide-y divide-gold/20">
                      {orders.slice(0, 6).map((o) => (
                        <li key={o.orderId} className="flex flex-wrap items-center justify-between gap-2 py-2.5 font-sans text-sm">
                          <Link href={`/admin/orders/${encodeURIComponent(o.orderId)}`} className="font-mono text-xs font-semibold text-burgundy hover:underline">{o.orderId}</Link>
                          <span className="text-xs text-umber">{formatDate(o.createdAt)}</span>
                          <span>{formatInr(o.totals.total)}</span>
                          <span className="flex gap-1"><Badge tone={statusTone(o.status)}>{cap(o.status)}</Badge><Badge tone={paymentTone(o.payment.status)}>{cap(o.payment.status)}</Badge></span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
                <div className="space-y-5">
                  <Card>
                    <h2 className="mb-3 flex items-center gap-2 font-display text-[1.3rem] font-bold text-burgundy"><Package aria-hidden="true" className="size-5" />Catalogue</h2>
                    <dl className="grid grid-cols-2 gap-3 font-sans text-sm">
                      <div><dt className="text-umber">Products</dt><dd className="text-xl font-bold">{products.length}</dd></div>
                      <div><dt className="text-umber">Visible</dt><dd className="text-xl font-bold">{products.filter((p) => p.visible).length}</dd></div>
                      <div><dt className="text-umber">Categories</dt><dd className="text-xl font-bold">{categories.length}</dd></div>
                      <div><dt className="text-umber">Combos</dt><dd className="text-xl font-bold">{combos.length}</dd></div>
                    </dl>
                  </Card>
                  <Card>
                    <h2 className="mb-3 flex items-center gap-2 font-display text-[1.3rem] font-bold text-burgundy"><AlertTriangle aria-hidden="true" className="size-5" />Low stock</h2>
                    {lowStock.length === 0 ? (
                      <p className="font-sans text-sm text-umber">Nothing low on stock{products.some((p) => p.variants.some((v) => typeof v.stock === "number")) ? "" : " (stock counts are not tracked yet)"}.</p>
                    ) : (
                      <ul className="space-y-1.5 font-sans text-sm">
                        {lowStock.slice(0, 8).map(({ p, label }, i) => (
                          <li key={`${p.productId}-${i}`} className="flex justify-between gap-2">
                            <Link href={`/admin/products/${p.productId}`} className="truncate hover:text-burgundy hover:underline">{p.name}</Link>
                            <span className="shrink-0 text-xs text-burgundy">{label}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                </div>
              </div>
            </>
          );
        })()
      )}
    </>
  );
}

export default function DashboardPage() {
  return (
    <>
      <AdminPageHeader title="Dashboard" description="An overview of orders, sales and your catalogue." />
      <Suspense fallback={<AdminLoading label="Loading dashboard" />}>
        <DashboardContent />
      </Suspense>
    </>
  );
}
