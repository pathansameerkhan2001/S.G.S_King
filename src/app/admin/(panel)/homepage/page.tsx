import type { Metadata } from "next";
import { Suspense } from "react";

import { HomepageForm } from "@/components/admin/HomepageForm";
import { AdminLoading, AdminPageHeader, ErrorState, Flash } from "@/components/admin/ui";
import type { HomepageConfig } from "@/lib/admin/schemas";
import { hero } from "@/content/site";
import { mediaLibrary, previewsFor } from "@/lib/server/admin-data";
import { requireAdmin } from "@/lib/server/auth";
import { load } from "@/lib/server/load";
import { listCategories, listProducts } from "@/lib/server/repo/catalog";
import { readDoc } from "@/lib/server/repo/documents";

import { saveHomepage } from "../content-actions";

export const metadata: Metadata = { title: "Homepage Manager" };

const fromWebsite: HomepageConfig = {
  hero: { eyebrow: hero.eyebrow, heading: `${hero.headingLine1} ${hero.headingLine2}`, subheading: hero.description, ctaLabel: hero.primaryCta.label, ctaHref: hero.primaryCta.href },
  featuredProductIds: [],
  collectionOrder: [],
  promoSections: [],
};

async function Content({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin("/admin/homepage");
  const params = await searchParams;
  const res = await load(async () => {
    const [doc, products, categories, library] = await Promise.all([readDoc("homepage"), listProducts(), listCategories(), mediaLibrary("homepage")]);
    const config = doc.data ?? fromWebsite;
    const previews = await previewsFor([config.hero.imageKey, ...config.promoSections.map((p) => p.imageKey)]);
    return { doc, config, products, categories, library, previews };
  });
  if (!res.ok) return <ErrorState {...res} />;
  const { doc, config, products, categories, library, previews } = res.data;
  return (
    <>
      <Flash params={params} />
      {!doc.data && (
        <p className="mb-4 rounded-xl border border-gold/50 bg-gold-pale/60 px-4 py-3 font-sans text-sm text-ink">
          No homepage configuration saved yet. The hero fields show the current website text.
        </p>
      )}
      <HomepageForm
        action={saveHomepage}
        initial={config}
        etag={doc.etag}
        products={products.map((p) => ({ id: p.productId, name: p.name }))}
        categories={categories.map((c) => ({ id: c.categoryId, name: c.name }))}
        library={library}
        previews={previews}
      />
    </>
  );
}

export default function HomepageAdminPage({ searchParams }: PageProps<"/admin/homepage">) {
  return (
    <>
      <AdminPageHeader title="Homepage Manager" description="Hero banner, featured products, collection order and promotional sections." crumbs={[{ label: "Homepage" }]} />
      <Suspense fallback={<AdminLoading label="Loading homepage settings" />}>
        <Content searchParams={searchParams} />
      </Suspense>
    </>
  );
}
