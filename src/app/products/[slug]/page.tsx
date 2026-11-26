import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ItemDetailView } from "@/components/catalog/ItemDetailView";
import { ItemJsonLd } from "@/components/catalog/ItemJsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { catalogProducts, categoryHref, categoryName, getProduct } from "@/lib/catalog";

export function generateStaticParams() {
  return catalogProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getProduct(slug);
  if (!item) return {};
  const description = item.description ?? `${item.name} from S.G.S King Foods, Kadapa, Rayalaseema.`;
  return {
    title: item.name,
    description,
    alternates: { canonical: item.href },
    openGraph: {
      title: `${item.name} | S.G.S King Foods`,
      description,
      url: item.href,
      images: item.images.map((i) => ({ url: i.src, alt: i.alt })),
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const item = getProduct(slug);
  if (!item) notFound();

  return (
    <div className="heritage-paper">
      <ItemJsonLd item={item} />
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-16 pt-6 sm:px-8 lg:px-10 lg:pb-24">
        <Breadcrumbs
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            ...(item.categorySlug ? [{ label: categoryName(item.categorySlug) ?? "", href: categoryHref(item.categorySlug) }] : []),
            { label: item.name },
          ]}
        />
        <ItemDetailView itemKey={item.key} />
      </div>
    </div>
  );
}
