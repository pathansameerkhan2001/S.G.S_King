import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { UrlCatalogBrowser } from "@/components/catalog/UrlCatalogBrowser";
import { PageHero } from "@/components/ui/PageHero";
import { catalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Shop traditional laddus, honey, sweets & chikkis, roasted nuts, masalas, instant mixes, millet powders and combo packs from S.G.S King Foods, Kadapa.",
  alternates: { canonical: "/shop" },
  openGraph: { title: "Shop All Products | S.G.S King Foods", url: "/shop" },
};

export default function ShopPage() {
  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Shop All Products"
        description="Traditional favourites from Kadapa, Rayalaseema: browse every product and combo pack, filter by category or price, and add to your cart."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
        compact
      />
      <section aria-label="Product catalogue" className="heritage-paper">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          {/* Fallback is the full default catalogue, so the grid is prerendered for SEO. */}
          <Suspense fallback={<CatalogBrowser items={catalog} searchPlaceholder="Search all products and combos…" />}>
            <UrlCatalogBrowser items={catalog} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
