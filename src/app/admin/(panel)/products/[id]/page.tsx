import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ConfirmSubmit } from "@/components/admin/forms";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminLoading, AdminPageHeader, ErrorState } from "@/components/admin/ui";
import { mediaLibrary, previewsFor } from "@/lib/server/admin-data";
import { requireAdmin } from "@/lib/server/auth";
import { load } from "@/lib/server/load";
import { getProduct, listCategories } from "@/lib/server/repo/catalog";

import { removeProduct, saveProduct } from "../actions";

export const metadata: Metadata = { title: "Edit Product" };

async function EditProductContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin(`/admin/products/${id}`);
  if (!/^prd_[a-z0-9]+$/.test(id)) notFound();
  const res = await load(async () => {
    const [product, categories, library] = await Promise.all([getProduct(id), listCategories(), mediaLibrary("products")]);
    return { product, categories, library, previews: product ? await previewsFor(product.images) : {} };
  });
  if (!res.ok) return <ErrorState {...res} />;
  const { product, categories, library, previews } = res.data;
  if (!product) notFound();

  return (
    <>
      <AdminPageHeader
        title={product.name}
        description={`Last updated ${new Date(product.updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`}
        crumbs={[{ label: "Products", href: "/admin/products" }, { label: product.name }]}
        actions={
          <ConfirmSubmit
            action={removeProduct}
            label="Delete product"
            title={`Delete “${product.name}”?`}
            description="This permanently removes the product. Products used in a combo cannot be deleted."
            hidden={{ id: product.productId, version: product.version }}
          />
        }
      />
      <ProductForm action={saveProduct} product={product} categories={categories} library={library} previews={previews} />
    </>
  );
}

export default function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  return (
    <Suspense fallback={<AdminLoading label="Loading product" />}>
      <EditProductContent params={params} />
    </Suspense>
  );
}
