import type { Metadata } from "next";
import { Suspense } from "react";

import { ProductForm } from "@/components/admin/ProductForm";
import { AdminLoading, AdminPageHeader, ErrorState } from "@/components/admin/ui";
import { mediaLibrary } from "@/lib/server/admin-data";
import { requireAdmin } from "@/lib/server/auth";
import { load } from "@/lib/server/load";
import { listCategories } from "@/lib/server/repo/catalog";

import { saveProduct } from "../actions";

export const metadata: Metadata = { title: "New Product" };

async function NewProductContent() {
  await requireAdmin("/admin/products/new");
  const res = await load(() => Promise.all([listCategories(), mediaLibrary("products")]));
  if (!res.ok) return <ErrorState {...res} />;
  const [categories, library] = res.data;
  return <ProductForm action={saveProduct} categories={categories} library={library} previews={{}} />;
}

export default function NewProductPage() {
  return (
    <>
      <AdminPageHeader title="New Product" crumbs={[{ label: "Products", href: "/admin/products" }, { label: "New" }]} />
      <Suspense fallback={<AdminLoading />}>
        <NewProductContent />
      </Suspense>
    </>
  );
}
