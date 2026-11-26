/**
 * Product catalogue (frontend demo data).
 *
 * This is the ONLY place product details live. Components receive `Product`
 * objects and never hardcode product content. When the admin panel /
 * database is connected, replace `products` with data fetched from the API
 * using the same `Product` shape.
 *
 * DEMO DATA: names, weights and prices below are temporary placeholders.
 * Images reuse the collection illustrations until real product photos are
 * uploaded through the admin panel. `rating` is null for every product
 * because no real customer reviews exist yet — the UI hides the rating row
 * when it is null. Never add invented ratings here.
 */

import type { CategorySlug } from "./categories";

export type ProductImage = {
  src: string;
  alt: string;
  /** "contain" for packshots on plain backgrounds, "cover" for lifestyle photos. */
  fit?: "contain" | "cover";
};

export type ProductRating = {
  /** Average star rating, 0–5. */
  average: number;
  /** Number of real, verified reviews. */
  count: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  categorySlug: CategorySlug;
  /** Weight or pack size shown on the card, e.g. "500 g". */
  variant: string;
  /** Selling price in whole rupees. */
  price: number;
  /** Original / MRP price in whole rupees (optional). */
  mrp?: number;
  image: ProductImage | null;
  /** Only set from real review data. */
  rating: ProductRating | null;
  isBestseller: boolean;
};

export const products: Product[] = [
  {
    id: "traditional-laddus-500g",
    slug: "traditional-laddus",
    name: "Traditional Laddus",
    categorySlug: "traditional-laddus",
    variant: "500 g",
    price: 399,
    mrp: 499,
    image: {
      src: "/images/collections/traditional-laddus.svg",
      alt: "Traditional laddus on a brass plate",
      fit: "cover",
    },
    rating: null,
    isBestseller: true,
  },
  {
    id: "pure-natural-honey-500g",
    slug: "pure-natural-honey",
    name: "Pure Natural Honey",
    categorySlug: "honey-blends",
    variant: "500 g",
    price: 549,
    mrp: 649,
    image: {
      src: "/images/collections/honey-blends.svg",
      alt: "Jar of pure natural honey with a wooden dipper",
      fit: "cover",
    },
    rating: null,
    isBestseller: true,
  },
  {
    id: "peanut-chikki-250g",
    slug: "peanut-chikki",
    name: "Peanut Chikki",
    categorySlug: "sweets-chikkis",
    variant: "250 g",
    price: 269,
    mrp: 299,
    image: {
      src: "/images/collections/sweets-chikkis.svg",
      alt: "Peanut chikki bars on a brass plate",
      fit: "cover",
    },
    rating: null,
    isBestseller: true,
  },
  {
    id: "roasted-mixed-nuts-250g",
    slug: "roasted-mixed-nuts",
    name: "Roasted Mixed Nuts",
    categorySlug: "roasted-nuts-snacks",
    variant: "250 g",
    price: 449,
    mrp: 599,
    image: {
      src: "/images/collections/roasted-nuts-snacks.svg",
      alt: "Brass bowl of roasted mixed nuts",
      fit: "cover",
    },
    rating: null,
    isBestseller: true,
  },
];

export const bestSellers = products.filter((product) => product.isBestseller);

export const productHref = (slug: string) => `/products/${slug}`;

/** Whole-number discount percentage, or null when there is no real discount. */
export function discountPercent(product: Pick<Product, "price" | "mrp">): number | null {
  if (!product.mrp || product.mrp <= product.price) return null;
  return Math.round(((product.mrp - product.price) / product.mrp) * 100);
}
