import type { Metadata } from "next";
import { Suspense } from "react";

import { ComboForm } from "@/components/admin/ComboForm";
import { AdminLoading, AdminPageHeader, ErrorState } from "@/components/admin/ui";
import { mediaLibrary } from "@/lib/server/admin-data";
import { requireAdmin } from "@/lib/server/auth";
import { load } from "@/lib/server/load";
import { listProducts } from "@/lib/server/repo/catalog";

import { saveCombo } from "../actions";

export const metadata: Metadata = { title: "New Combo" };

async function Content() {
  await requireAdmin("/admin/combos/new");
  const res = await load(() => Promise.all([listProducts(), mediaLibrary("combos")]));
  if (!res.ok) return <ErrorState {...res} />;
  const [products, library] = res.data;
  return (
    <ComboForm
      action={saveCombo}
      products={products.map((p) => ({ productId: p.productId, name: p.name, price: p.variants[0]?.price ?? 0 }))}
      library={library}
      previews={{}}
    />
  );
}

export default function NewComboPage() {
  return (
    <>
      <AdminPageHeader title="New Combo" crumbs={[{ label: "Combos", href: "/admin/combos" }, { label: "New" }]} />
      <Suspense fallback={<AdminLoading />}>
        <Content />
      </Suspense>
    </>
  );
}
