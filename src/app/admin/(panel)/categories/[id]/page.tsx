import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CategoryForm } from "@/components/admin/CategoryForm";
import { AdminLoading, AdminPageHeader, ErrorState } from "@/components/admin/ui";
import { mediaLibrary, previewsFor } from "@/lib/server/admin-data";
import { requireAdmin } from "@/lib/server/auth";
import { load } from "@/lib/server/load";
import { getCategory } from "@/lib/server/repo/catalog";

import { saveCategory } from "../actions";

export const metadata: Metadata = { title: "Edit Category" };

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin(`/admin/categories/${id}`);
  if (!/^[a-z0-9-]{2,80}$/.test(id)) notFound();
  const res = await load(async () => {
    const [category, library] = await Promise.all([getCategory(id), mediaLibrary("categories")]);
    return { category, library, previews: await previewsFor([category?.imageKey]) };
  });
  if (!res.ok) return <ErrorState {...res} />;
  if (!res.data.category) notFound();
  return (
    <>
      <AdminPageHeader title={res.data.category.name} crumbs={[{ label: "Categories", href: "/admin/categories" }, { label: res.data.category.name }]} />
      <CategoryForm action={saveCategory} category={res.data.category} library={res.data.library} previews={res.data.previews} />
    </>
  );
}

export default function EditCategoryPage({ params }: PageProps<"/admin/categories/[id]">) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Content params={params} />
    </Suspense>
  );
}
