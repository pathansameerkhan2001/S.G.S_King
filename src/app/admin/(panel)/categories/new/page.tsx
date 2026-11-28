import type { Metadata } from "next";
import { Suspense } from "react";

import { CategoryForm } from "@/components/admin/CategoryForm";
import { AdminLoading, AdminPageHeader, ErrorState } from "@/components/admin/ui";
import { mediaLibrary } from "@/lib/server/admin-data";
import { requireAdmin } from "@/lib/server/auth";
import { load } from "@/lib/server/load";

import { saveCategory } from "../actions";

export const metadata: Metadata = { title: "New Category" };

async function Content() {
  await requireAdmin("/admin/categories/new");
  const res = await load(() => mediaLibrary("categories"));
  if (!res.ok) return <ErrorState {...res} />;
  return <CategoryForm action={saveCategory} library={res.data} previews={{}} />;
}

export default function NewCategoryPage() {
  return (
    <>
      <AdminPageHeader title="New Category" crumbs={[{ label: "Categories", href: "/admin/categories" }, { label: "New" }]} />
      <Suspense fallback={<AdminLoading />}>
        <Content />
      </Suspense>
    </>
  );
}
