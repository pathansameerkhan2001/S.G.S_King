import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ItemDetailView } from "@/components/catalog/ItemDetailView";
import { ItemJsonLd } from "@/components/catalog/ItemJsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { catalogCombos, getCombo } from "@/lib/catalog";

export function generateStaticParams() {
  return catalogCombos.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/combos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getCombo(slug);
  if (!item) return {};
  const description = item.description ?? `${item.name} combo pack from S.G.S King Foods.`;
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

export default async function ComboPage({ params }: PageProps<"/combos/[slug]">) {
  const { slug } = await params;
  const item = getCombo(slug);
  if (!item) notFound();

  return (
    <div className="heritage-paper">
      <ItemJsonLd item={item} />
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-16 pt-6 sm:px-8 lg:px-10 lg:pb-24">
        <Breadcrumbs
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Combo Products", href: "/shop?type=combo" },
            { label: item.name },
          ]}
        />
        <ItemDetailView itemKey={item.key} />
      </div>
    </div>
  );
}
