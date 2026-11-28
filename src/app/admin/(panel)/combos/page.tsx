import { Pencil, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ConfirmSubmit } from "@/components/admin/forms";
import { AdminLoading, AdminPageHeader, Badge, EmptyState, ErrorState, Flash, formatInr, matchesQ, primaryButton, TableWrap, td, th } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/server/auth";
import { load } from "@/lib/server/load";
import { listCombos, listProducts } from "@/lib/server/repo/catalog";

import { removeCombo } from "./actions";

export const metadata: Metadata = { title: "Combos" };

async function CombosContent({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin("/admin/combos");
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const res = await load(() => Promise.all([listCombos(), listProducts()]));
  if (!res.ok) return <ErrorState {...res} />;
  const [combos, products] = res.data;
  const names = new Map(products.map((p) => [p.productId, p.name]));
  const rows = combos.filter((c) => matchesQ(q, c.name, c.slug, ...c.items.map((i) => names.get(i.productId))));

  return (
    <>
      <Flash params={params} />
      {combos.length === 0 ? (
        <EmptyState
          title="No combos yet"
          text="Bundle existing products into gift boxes and family packs."
          action={
            <Link href="/admin/combos/new" className={primaryButton}>
              <Plus aria-hidden="true" className="size-4" />
              Add combo
            </Link>
          }
        />
      ) : rows.length === 0 ? (
        <EmptyState title="No combos match" />
      ) : (
        <TableWrap label="Combos">
          <thead>
            <tr>
              <th scope="col" className={th}>Combo</th>
              <th scope="col" className={th}>Contents</th>
              <th scope="col" className={th}>Price</th>
              <th scope="col" className={th}>Status</th>
              <th scope="col" className={`${th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.comboId} className="hover:bg-cream/40">
                <td className={td}>
                  <Link href={`/admin/combos/${c.comboId}`} className="font-semibold hover:text-burgundy hover:underline">
                    {c.name}
                  </Link>
                  <div className="text-xs text-umber">/{c.slug}</div>
                </td>
                <td className={`${td} text-xs`}>
                  {c.items.map((i) => (
                    <div key={i.productId}>
                      {names.get(i.productId) ?? <Badge tone="bad">Missing product</Badge>} × {i.quantity}
                    </div>
                  ))}
                </td>
                <td className={td}>
                  {formatInr(c.price)}
                  {c.mrp && c.mrp > c.price ? <div className="text-xs text-umber line-through">{formatInr(c.mrp)}</div> : null}
                </td>
                <td className={td}>
                  <div className="flex flex-wrap gap-1">
                    {c.visible ? <Badge tone="good">Visible</Badge> : <Badge>Hidden</Badge>}
                    {c.isFeatured && <Badge tone="info">Featured</Badge>}
                    {c.availability !== "in_stock" && (
                      <Badge tone={c.availability === "out_of_stock" ? "bad" : "warn"}>{c.availability === "out_of_stock" ? "Out of stock" : "Low stock"}</Badge>
                    )}
                  </div>
                </td>
                <td className={`${td} text-right`}>
                  <div className="flex justify-end gap-1">
                    <Link href={`/admin/combos/${c.comboId}`} aria-label={`Edit ${c.name}`} className="grid size-10 place-items-center rounded-xl text-burgundy hover:bg-gold-pale">
                      <Pencil aria-hidden="true" className="size-4" />
                    </Link>
                    <ConfirmSubmit
                      compact
                      action={removeCombo}
                      label={`Delete ${c.name}`}
                      title={`Delete “${c.name}”?`}
                      description="This permanently removes the combo. The products inside it are not affected."
                      hidden={{ id: c.comboId, version: c.version }}
                    />
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

export default function CombosPage({ searchParams }: PageProps<"/admin/combos">) {
  return (
    <>
      <AdminPageHeader
        title="Combos"
        description="Gift boxes, family packs and value bundles built from your products."
        crumbs={[{ label: "Combos" }]}
        actions={
          <Link href="/admin/combos/new" className={primaryButton}>
            <Plus aria-hidden="true" className="size-4" />
            Add combo
          </Link>
        }
      />
      <Suspense fallback={<AdminLoading label="Loading combos" />}>
        <CombosContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
