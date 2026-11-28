import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CatalogBrowser } from "@/components/catalog/CatalogBrowser";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories, categoryHref } from "@/content/categories";
import { categoryDetails } from "@/content/categoryDetails";
import { itemsInCategory } from "@/lib/catalog";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

const findCategory = (slug: string) => categories.find((c) => c.slug === slug);

export async function generateMetadata({ params }: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategory(slug);
  if (!category) return {};
  const details = categoryDetails[category.slug];
  return {
    title: category.name,
    description: details.description,
    alternates: { canonical: categoryHref(category.slug) },
    openGraph: {
      title: `${category.name} | S.G.S King Foods`,
      description: details.description,
      url: categoryHref(category.slug),
      images: [{ url: category.image.src, alt: category.image.alt }],
    },
  };
}

export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const category = findCategory(slug);
  if (!category) notFound();

  const details = categoryDetails[category.slug];
  const items = itemsInCategory(category.slug);
  const related = categories.filter((c) => c.slug !== category.slug);

  return (
    <>
      <PageHero
        eyebrow={details.tagline}
        title={category.name}
        description={details.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: category.name },
        ]}
      >
        <div className="relative mx-auto mt-6 aspect-[5/4] w-40 overflow-hidden rounded-full border-4 border-ivory shadow-card ring-1 ring-gold/50 sm:w-48">
          <Image src={category.image.src} alt={category.image.alt} fill unoptimized sizes="192px" className="object-cover" preload />
        </div>
      </PageHero>

      <section aria-label={`${category.name} products`} className="heritage-paper">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <CatalogBrowser
            items={items}
            showCategoryFilter={false}
            showTypeFilter={false}
            searchPlaceholder={`Search ${category.name}…`}
            emptyMessage={items.length === 0 ? "Products in this category are coming soon." : "No products match your filters."}
          />
        </div>
      </section>

      <section aria-labelledby="related-categories" className="border-t border-gold/25 bg-cream/60 py-12 sm:py-16">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-8 lg:px-10">
          <SectionHeading id="related-categories" eyebrow="Explore more" title="Related Categories" />
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
            {related.map((c) => (
              <li key={c.slug}>
                <Link
                  href={categoryHref(c.slug)}
                  className="group flex h-full flex-col items-center gap-2 rounded-2xl border border-gold/30 bg-ivory p-3 text-center transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-gold/70"
                >
                  <span className="relative aspect-square w-full max-w-24 overflow-hidden rounded-full border border-gold/40">
                    <Image src={c.image.src} alt="" fill unoptimized sizes="96px" className="scale-125 object-cover object-[50%_60%]" />
                  </span>
                  <span className="font-display text-[1rem] font-semibold leading-tight text-burgundy">{c.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
