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

export type ProductVariantData = {
  id: string;
  /** Weight / size label, e.g. "500 g". */
  label: string;
  price: number;
  mrp?: number;
  /** Units in stock, when known (admin-managed). */
  stock?: number;
};

export type ProductFaq = { question: string; answer: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  categorySlug: CategorySlug;
  /** Weight or pack size shown on the card, e.g. "500 g" (default variant). */
  variant: string;
  /** Selling price in whole rupees (default variant). */
  price: number;
  /** Original / MRP price in whole rupees (optional). */
  mrp?: number;
  image: ProductImage | null;
  /** Only set from real review data. */
  rating: ProductRating | null;
  isBestseller: boolean;

  // ---- Optional detail fields (admin-managed later). Leave undefined rather
  // than inventing content: the UI hides any section without real data. ----
  description?: string;
  /** All sizes; when set, the first entry should match variant/price above. */
  variants?: ProductVariantData[];
  /** Additional gallery images (shown after `image`). */
  gallery?: ProductImage[];
  badge?: string;
  /** Real ingredient list only. */
  ingredients?: string[];
  /** Real storage guidance only. */
  storage?: string;
  /** Real, verified nutrition values only. */
  nutrition?: { label: string; value: string }[];
  faqs?: ProductFaq[];
  availability?: "in_stock" | "low_stock" | "out_of_stock";
  /** Lower first in the "Featured" sort. */
  displayOrder?: number;
  /** ISO date the product was added; drives the "Newest" sort. */
  addedOn?: string;
  /** Marks placeholder catalogue entries used during development. */
  isDemo?: boolean;
};

const categoryImage: Record<CategorySlug, string> = {
  "traditional-laddus": "/images/collections/traditional-laddus.svg",
  "honey-blends": "/images/collections/honey-blends.svg",
  "sweets-chikkis": "/images/collections/sweets-chikkis.svg",
  "roasted-nuts-snacks": "/images/collections/roasted-nuts-snacks.svg",
  "masalas-spices": "/images/collections/masalas-spices.svg",
  "instant-food-mixes": "/images/collections/instant-food-mixes.svg",
  "millet-nutrition-powders": "/images/collections/millet-nutrition-powders.svg",
};

type DemoSize = [id: string, label: string, price: number, mrp?: number];

/** Builds a demo catalogue entry (image = its category illustration). */
function demo(
  slug: string,
  name: string,
  categorySlug: CategorySlug,
  description: string,
  sizes: DemoSize[],
  displayOrder: number,
  addedOn: string,
): Product {
  const variants = sizes.map(([id, label, price, mrp]) => ({ id, label, price, mrp }));
  return {
    id: slug,
    slug,
    name,
    categorySlug,
    variant: variants[0].label,
    price: variants[0].price,
    mrp: variants[0].mrp,
    variants: variants.length > 1 ? variants : undefined,
    image: { src: categoryImage[categorySlug], alt: name, fit: "cover" },
    rating: null,
    isBestseller: false,
    description,
    displayOrder,
    addedOn,
    isDemo: true,
  };
}

export const products: Product[] = [
  {
    id: "traditional-laddus-500g",
    slug: "traditional-laddus",
    name: "Traditional Laddus",
    description: "An assortment of classic laddus prepared in small batches.",
    displayOrder: 1,
    addedOn: "2026-10-01",
    isDemo: true,
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
    description: "Golden natural honey, packed fresh in a glass jar.",
    displayOrder: 2,
    addedOn: "2026-10-01",
    isDemo: true,
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
    displayOrder: 3,
    addedOn: "2026-10-01",
    isDemo: true,
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
    description: "A crunchy mix of roasted nuts for everyday snacking.",
    displayOrder: 4,
    addedOn: "2026-10-01",
    isDemo: true,
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

  // ---- Demo catalogue entries (not best sellers) so every category has
  // products during development. Replace via the admin panel. ----
  demo("masala-peanuts", "Masala Peanuts", "roasted-nuts-snacks", "A spiced, crunchy peanut snack.", [["200g", "200 g", 129, 149]], 5, "2026-11-10"),
  demo("honey-dry-fruit-blend", "Honey & Dry Fruit Blend", "honey-blends", "Natural honey blended with chopped dry fruits.", [["250g", "250 g", 349, 399]], 6, "2026-11-12"),
  demo("andhra-chilli-powder", "Andhra Chilli Powder", "masalas-spices", "Bold, vibrant chilli powder for everyday Andhra cooking.", [["200g", "200 g", 149, 179], ["500g", "500 g", 329, 389]], 7, "2026-11-05"),
  demo("sambar-powder", "Sambar Powder", "masalas-spices", "A traditional blend for homestyle sambar.", [["200g", "200 g", 129, 149]], 8, "2026-11-15"),
  demo("instant-upma-mix", "Instant Upma Mix", "instant-food-mixes", "Ready-to-cook upma mix for quick breakfasts.", [["500g", "500 g", 149]], 9, "2026-11-08"),
  demo("instant-pesarattu-mix", "Instant Pesarattu Mix", "instant-food-mixes", "Green gram dosa mix in the Andhra style.", [["500g", "500 g", 179, 199]], 10, "2026-11-18"),
  demo("ragi-malt-powder", "Ragi Malt Powder", "millet-nutrition-powders", "Finger millet powder for a warm, comforting drink.", [["500g", "500 g", 199, 229]], 11, "2026-11-02"),
  demo("multi-millet-mix", "Multi-Millet Mix", "millet-nutrition-powders", "A blend of traditional millets for porridge and rotis.", [["500g", "500 g", 249, 279], ["1kg", "1 kg", 469, 529]], 12, "2026-11-20"),
];

export const bestSellers = products.filter((product) => product.isBestseller);

export const productHref = (slug: string) => `/products/${slug}`;

/** Whole-number discount percentage, or null when there is no real discount. */
export function discountPercent(product: Pick<Product, "price" | "mrp">): number | null {
  if (!product.mrp || product.mrp <= product.price) return null;
  return Math.round(((product.mrp - product.price) / product.mrp) * 100);
}
