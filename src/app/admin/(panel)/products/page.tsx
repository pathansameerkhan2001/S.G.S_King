import { Pencil, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ConfirmSubmit } from "@/components/admin/forms";
import { AdminLoading, AdminPageHeader, Badge, EmptyState, ErrorState, Flash, formatInr, matchesQ, primaryButton, TableWrap, td, th } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/server/auth";
import { load } from "@/lib/server/load";
import { listCategories, listProducts } from "@/lib/server/repo/catalog";

import { removeProduct } from "./actions";

export const metadata: Metadata = { title: "Products" };

type Params = Record<string, string | string[] | undefined>;

async function ProductsContent({ searchParams }: { searchParams: Promise<Params> }) {
  await requireAdmin("/admin/products");
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const category = typeof params.category === "string" ? params.category : "";
  const visibility = typeof params.visibility === "string" ? params.visibility : "";

  const res = await load(() => Promise.all([listProducts(), listCategories()]));
  if (!res.ok) return <ErrorState {...res} />;
  const [products, categories] = res.data;
  const categoryName = new Map(categories.map((c) => [c.categoryId, c.name]));
  const rows = products.filter(
    (p) =>
      matchesQ(q, p.name, p.slug, categoryName.get(p.categoryId)) &&
      (!category || p.categoryId === category) &&
      (!visibility || (visibility === "visible" ? p.visible : !p.visible)),
  );

  return (
    <>
      <Flash params={params} />
      <form className="mb-4 flex flex-wrap items-end gap-2" role="search" aria-label="Filter products">
        {q && <input type="hidden" name="q" value={q} />}
        <label className="font-sans text-xs font-semibold text-umber">
          Category
          <select name="category" defaultValue={category} className="mt-1 block h-10 rounded-xl border border-gold/45 bg-ivory px-3 text-sm">
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="font-sans text-xs font-semibold text-umber">
          Visibility
          <select name="visibility" defaultValue={visibility} className="mt-1 block h-10 rounded-xl border border-gold/45 bg-ivory px-3 text-sm">
            <option value="">All</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>
        <button type="submit" className="h-10 rounded-xl border border-gold/50 px-4 font-sans text-sm font-semibold text-burgundy hover:bg-gold-pale">
          Apply
        </button>
        <p className="ml-auto font-sans text-sm text-umber" role="status">
          {rows.length} of {products.length} products
        </p>
      </form>

      {products.length === 0 ? (
        <EmptyState
          title="No products yet"
          text={categories.length === 0 ? "Create a category first, then add your products." : "Add your first product to get started."}
          action={
            <Link href={categories.length === 0 ? "/admin/categories/new" : "/admin/products/new"} className={primaryButton}>
              <Plus aria-hidden="true" className="size-4" />
              {categories.length === 0 ? "Create category" : "Add product"}
            </Link>
          }
        />
      ) : rows.length === 0 ? (
        <EmptyState title="No products match" text="Try a different search or filter." />
      ) : (
        <TableWrap label="Products">
          <thead>
            <tr>
              <th scope="col" className={th}>Product</th>
              <th scope="col" className={th}>Category</th>
              <th scope="col" className={th}>Price</th>
              <th scope="col" className={th}>Stock</th>
              <th scope="col" className={th}>Status</th>
              <th scope="col" className={`${th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const prices = p.variants.map((v) => v.price);
              const tracked = p.variants.filter((v) => typeof v.stock === "number");
              return (
                <tr key={p.productId} className="hover:bg-cream/40">
                  <td className={td}>
                    <Link href={`/admin/products/${p.productId}`} className="font-semibold text-ink hover:text-burgundy hover:underline">
                      {p.name}
                    </Link>
                    <div className="text-xs text-umber">/{p.slug} · {p.variants.length} size(s)</div>
                  </td>
                  <td className={td}>{categoryName.get(p.categoryId) ?? <Badge tone="bad">Missing</Badge>}</td>
                  <td className={td}>
                    {formatInr(Math.min(...prices))}
                    {prices.length > 1 && ` – ${formatInr(Math.max(...prices))}`}
                  </td>
                  <td className={td}>
                    {p.availability === "out_of_stock" ? (
                      <Badge tone="bad">Out of stock</Badge>
                    ) : p.availability === "low_stock" ? (
                      <Badge tone="warn">Low stock</Badge>
                    ) : (
                      <Badge tone="good">In stock</Badge>
                    )}
                    {tracked.length > 0 && <div className="mt-0.5 text-xs text-umber">{tracked.reduce((n, v) => n + (v.stock ?? 0), 0)} units</div>}
                  </td>
                  <td className={td}>
                    <div className="flex flex-wrap gap-1">
                      {p.visible ? <Badge tone="good">Visible</Badge> : <Badge>Hidden</Badge>}
                      {p.isBestseller && <Badge tone="info">Bestseller</Badge>}
                      {p.isFeatured && <Badge tone="info">Featured</Badge>}
                    </div>
                  </td>
                  <td className={`${td} text-right`}>
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/products/${p.productId}`} aria-label={`Edit ${p.name}`} className="grid size-10 place-items-center rounded-xl text-burgundy hover:bg-gold-pale">
                        <Pencil aria-hidden="true" className="size-4" />
                      </Link>
                      <ConfirmSubmit
                        compact
                        action={removeProduct}
                        label={`Delete ${p.name}`}
                        title={`Delete “${p.name}”?`}
                        description="This permanently removes the product. Products used in a combo cannot be deleted."
                        hidden={{ id: p.productId, version: p.version }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      )}
    </>
  );
}

export default function ProductsPage({ searchParams }: PageProps<"/admin/products">) {
  return (
    <>
      <AdminPageHeader
        title="Products"
        description="Manage products, sizes, prices, stock and images."
        crumbs={[{ label: "Products" }]}
        actions={
          <Link href="/admin/products/new" className={primaryButton}>
            <Plus aria-hidden="true" className="size-4" />
            Add product
          </Link>
        }
      />
      <Suspense fallback={<AdminLoading label="Loading products" />}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
