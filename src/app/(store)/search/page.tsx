import type { Metadata } from "next";
import { Suspense } from "react";

import { SearchResults } from "@/components/catalog/SearchResults";
import { PageHero } from "@/components/ui/PageHero";
import { CardGridSkeleton } from "@/components/ui/Skeletons";

export const metadata: Metadata = {
  title: "Search",
  description: "Search S.G.S King Foods products, combo packs and categories.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <>
      <PageHero compact title="Search" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <section aria-label="Search" className="heritage-paper">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <Suspense fallback={<CardGridSkeleton count={4} />}>
            <SearchResults />
          </Suspense>
        </div>
      </section>
    </>
  );
}
