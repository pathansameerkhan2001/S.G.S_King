/** Copy for the homepage "Our Best Sellers" section. Products come from ./products.ts. */

export const bestSellersSection = {
  heading: "Our Best Sellers",
  subtitle: "Most Loved Traditional Favourites",
  viewAll: { label: "View All Best Sellers", href: "/shop?sort=bestsellers" },
} as const;

export type TrustHighlight = {
  icon: "taste" | "quality" | "packed" | "delivery";
  title: string;
  detail: string;
};

export const trustHighlights: TrustHighlight[] = [
  { icon: "taste", title: "Authentic Taste", detail: "Traditional Recipes" },
  { icon: "quality", title: "Premium Quality", detail: "Handpicked Ingredients" },
  { icon: "packed", title: "Hygienically Packed", detail: "Freshness Sealed" },
  { icon: "delivery", title: "Pan India Delivery", detail: "Safe & Reliable" },
];
