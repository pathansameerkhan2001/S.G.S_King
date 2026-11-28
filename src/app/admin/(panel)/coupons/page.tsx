import { Pencil } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ConfirmSubmit } from "@/components/admin/forms";
import { CouponForm } from "@/components/admin/ReviewCouponForms";
import { AdminLoading, AdminPageHeader, Badge, Card, EmptyState, ErrorState, Flash, formatInr, matchesQ, TableWrap, td, th } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/server/auth";
import { load } from "@/lib/server/load";
import { readDoc } from "@/lib/server/repo/documents";

import { removeCoupon, saveCoupon } from "../content-actions";

export const metadata: Metadata = { title: "Coupons" };

const today = () => new Date().toISOString().slice(0, 10);

async function Content({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin("/admin/coupons");
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const edit = typeof params.edit === "string" ? params.edit : undefined;
  const res = await load(() => readDoc("coupons"));
  if (!res.ok) return <ErrorState {...res} />;
  const { data: coupons, etag } = res.data;
  const editing = edit ? coupons.find((c) => c.code === edit) : undefined;
  const rows = coupons.filter((c) => matchesQ(q, c.code));
  const status = (c: (typeof coupons)[number]) => {
    if (!c.active) return <Badge>Disabled</Badge>;
    if (c.endsAt && c.endsAt < today()) return <Badge tone="bad">Expired</Badge>;
    if (c.startsAt && c.startsAt > today()) return <Badge tone="info">Scheduled</Badge>;
    if (c.maxUses && c.usedCount >= c.maxUses) return <Badge tone="bad">Used up</Badge>;
    return <Badge tone="good">Active</Badge>;
  };

  return (
    <>
      <Flash params={params} />
      <Card className="mb-6">
        <h2 className="mb-3 font-display text-[1.3rem] font-bold text-burgundy">{editing ? `Edit ${editing.code}` : "Create a coupon"}</h2>
        <p className="mb-3 font-sans text-xs text-umber">Coupons are applied once the storefront checkout is connected to the backend.</p>
        <CouponForm key={editing?.code ?? "new"} action={saveCoupon} coupon={editing} etag={etag} />
      </Card>
      {coupons.length === 0 ? (
        <EmptyState title="No coupons yet" />
      ) : rows.length === 0 ? (
        <EmptyState title="No coupons match" />
      ) : (
        <TableWrap label="Coupons">
          <thead>
            <tr>
              <th scope="col" className={th}>Code</th>
              <th scope="col" className={th}>Discount</th>
              <th scope="col" className={th}>Rules</th>
              <th scope="col" className={th}>Usage</th>
              <th scope="col" className={th}>Status</th>
              <th scope="col" className={`${th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.code}>
                <td className={`${td} font-mono font-semibold`}>{c.code}</td>
                <td className={td}>{c.type === "percent" ? `${c.value}%` : formatInr(c.value)}</td>
                <td className={`${td} text-xs`}>
                  {c.minOrder ? <div>Min order {formatInr(c.minOrder)}</div> : null}
                  {c.perCustomerLimit ? <div>{c.perCustomerLimit} per customer</div> : null}
                  {(c.startsAt || c.endsAt) && <div>{c.startsAt ?? "…"} → {c.endsAt ?? "…"}</div>}
                </td>
                <td className={td}>{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ""}</td>
                <td className={td}>{status(c)}</td>
                <td className={`${td} text-right`}>
                  <div className="flex justify-end gap-1">
                    <Link href={`/admin/coupons?edit=${encodeURIComponent(c.code)}`} aria-label={`Edit ${c.code}`} className="grid size-10 place-items-center rounded-xl text-burgundy hover:bg-gold-pale"><Pencil aria-hidden="true" className="size-4" /></Link>
                    <ConfirmSubmit compact action={removeCoupon} label={`Delete ${c.code}`} title={`Delete coupon ${c.code}?`} description="This permanently removes the coupon." hidden={{ code: c.code }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </>
  );
}

export default function CouponsPage({ searchParams }: PageProps<"/admin/coupons">) {
  return (
    <>
      <AdminPageHeader title="Coupons" description="Discount codes, validity dates and usage limits." crumbs={[{ label: "Coupons" }]} />
      <Suspense fallback={<AdminLoading label="Loading coupons" />}>
        <Content searchParams={searchParams} />
      </Suspense>
    </>
  );
}
