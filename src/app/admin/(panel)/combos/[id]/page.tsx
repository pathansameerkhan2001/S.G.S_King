import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ComboForm } from "@/components/admin/ComboForm";
import { AdminLoading, AdminPageHeader, ErrorState } from "@/components/admin/ui";
import { mediaLibrary, previewsFor } from "@/lib/server/admin-data";
import { requireAdmin } from "@/lib/server/auth";
import { load } from "@/lib/server/load";
import { getCombo, listProducts } from "@/lib/server/repo/catalog";

import { saveCombo } from "../actions";

export const metadata: Metadata = { title: "Edit Combo" };

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAdmin(`/admin/combos/${id}`);
  if (!/^cmb_[a-z0-9]+$/.test(id)) notFound();
  const res = await load(async () => {
    const [combo, products, library] = await Promise.all([getCombo(id), listProducts(), mediaLibrary("combos")]);
    return { combo, products, library, previews: combo ? await previewsFor(combo.images) : {} };
  });
  if (!res.ok) return <ErrorState {...res} />;
  const { combo, products, library, previews } = res.data;
  if (!combo) notFound();
  return (
    <>
      <AdminPageHeader title={combo.name} crumbs={[{ label: "Combos", href: "/admin/combos" }, { label: combo.name }]} />
      <ComboForm
        action={saveCombo}
        combo={combo}
        products={products.map((p) => ({ productId: p.productId, name: p.name, price: p.variants[0]?.price ?? 0 }))}
        library={library}
        previews={previews}
      />
    </>
  );
}

export default function EditComboPage({ params }: PageProps<"/admin/combos/[id]">) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <Content params={params} />
    </Suspense>
  );
}
