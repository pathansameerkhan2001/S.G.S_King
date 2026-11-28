import { Pencil, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ConfirmSubmit } from "@/components/admin/forms";
import { AdminLoading, AdminPageHeader, Badge, EmptyState, ErrorState, Flash, matchesQ, primaryButton, TableWrap, td, th } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/server/auth";
import { load } from "@/lib/server/load";
import { listCategories, listProducts } from "@/lib/server/repo/catalog";

import { importStorefrontCategories, removeCategory } from "./actions";

export const metadata: Metadata = { title: "Categories" };

async function CategoriesContent({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin("/admin/categories");
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const res = await load(() => Promise.all([listCategories(), listProducts()]));
  if (!res.ok) return <ErrorState {...res} />;
  const [categories, products] = res.data;
  const counts = new Map<string, number>();
  products.forEach((p) => counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1));
  const rows = categories.filter((c) => matchesQ(q, c.name, c.categoryId, c.description));

  return (
    <>
      <Flash params={params} />
      {categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          text="Import the 7 categories already shown on the storefront, or create your own."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <ConfirmSubmit
                action={importStorefrontCategories}
                label="Import storefront categories"
                title="Import the 7 storefront categories?"
                description="Creates Traditional Laddus, Honey & Honey Blends, Sweets & Chikkis, Roasted Nuts & Snacks, Masalas & Spices, Instant Food Mixes and Millet & Nutrition Powders with their current descriptions. Existing categories are not changed."
                hidden={{}}
                confirmLabel="Import"
                icon="import"
              />
              <Link href="/admin/categories/new" className={primaryButton}><Plus aria-hidden="true" className="size-4" />Add category</Link>
            </div>
          }
        />
      ) : rows.length === 0 ? (
        <EmptyState title="No categories match" />
      ) : (
        <TableWrap label="Categories">
          <thead>
            <tr>
              <th scope="col" className={th}>Order</th>
              <th scope="col" className={th}>Category</th>
              <th scope="col" className={th}>Products</th>
              <th scope="col" className={th}>Status</th>
              <th scope="col" className={`${th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.categoryId} className="hover:bg-cream/40">
                <td className={td}>{c.displayOrder}</td>
                <td className={td}>
                  <Link href={`/admin/categories/${c.categoryId}`} className="font-semibold hover:text-burgundy hover:underline">{c.name}</Link>
                  <div className="text-xs text-umber">/categories/{c.categoryId}</div>
                </td>
                <td className={td}>{counts.get(c.categoryId) ?? 0}</td>
                <td className={td}>{c.visible ? <Badge tone="good">Visible</Badge> : <Badge>Hidden</Badge>}</td>
                <td className={`${td} text-right`}>
                  <div className="flex justify-end gap-1">
                    <Link href={`/admin/categories/${c.categoryId}`} aria-label={`Edit ${c.name}`} className="grid size-10 place-items-center rounded-xl text-burgundy hover:bg-gold-pale"><Pencil aria-hidden="true" className="size-4" /></Link>
                    <ConfirmSubmit compact action={removeCategory} label={`Delete ${c.name}`} title={`Delete “${c.name}”?`} description="Categories that still contain products cannot be deleted." hidden={{ id: c.categoryId, version: c.version }} />
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

export default function CategoriesPage({ searchParams }: PageProps<"/admin/categories">) {
  return (
    <>
      <AdminPageHeader title="Categories" description="Name, describe, order and show or hide product categories." crumbs={[{ label: "Categories" }]} actions={<Link href="/admin/categories/new" className={primaryButton}><Plus aria-hidden="true" className="size-4" />Add category</Link>} />
      <Suspense fallback={<AdminLoading label="Loading categories" />}>
        <CategoriesContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
