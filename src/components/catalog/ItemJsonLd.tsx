import type { CatalogItem } from "@/lib/catalog";

/** schema.org Product markup (no ratings: none exist yet). */
export function ItemJsonLd({ item }: { item: CatalogItem }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description: item.description,
    image: item.images.map((i) => i.src),
    brand: { "@type": "Brand", name: "S.G.S King Foods" },
    offers: item.variants.map((v) => ({
      "@type": "Offer",
      name: v.label,
      price: v.price,
      priceCurrency: "INR",
      availability:
        item.availability === "out_of_stock" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: item.href,
    })),
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: all values come from our own catalogue data.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
