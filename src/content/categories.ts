/**
 * Single source of truth for S.G.S King product categories.
 *
 * Every category surface (header dropdown, mobile menu, search suggestions,
 * homepage "Our Collections", and future category/product pages) imports
 * from here. Add, rename or reorder categories only in this file.
 *
 * IMAGES — TEMPORARY: each `image.src` points to an original placeholder
 * illustration in public/images/collections/. Replace with real product
 * photography (recommended 1200×960, 5:4, JPG/WebP) by dropping the new file
 * in that folder and updating `src` (and `width`/`height` if different).
 */

export type CategoryImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type Category = {
  /** Display name, used everywhere the category appears. */
  name: string;
  /** URL-safe identifier, used for routes and keys. */
  slug: string;
  image: CategoryImage;
};

const placeholder = (slug: string, alt: string): CategoryImage => ({
  src: `/images/collections/${slug}.svg`,
  width: 800,
  height: 640,
  alt,
});

export const categories = [
  {
    name: "Traditional Laddus",
    slug: "traditional-laddus",
    image: placeholder(
      "traditional-laddus",
      "Boondi, besan and dry-fruit laddus stacked on a brass plate",
    ),
  },
  {
    name: "Honey & Honey Blends",
    slug: "honey-blends",
    image: placeholder(
      "honey-blends",
      "Jar of natural honey with a wooden dipper and honeycomb",
    ),
  },
  {
    name: "Sweets & Chikkis",
    slug: "sweets-chikkis",
    image: placeholder(
      "sweets-chikkis",
      "Peanut chikki bars and diamond-cut sweets on a brass plate",
    ),
  },
  {
    name: "Roasted Nuts & Snacks",
    slug: "roasted-nuts-snacks",
    image: placeholder(
      "roasted-nuts-snacks",
      "Brass bowl of roasted almonds, cashews, peanuts and pistachios",
    ),
  },
  {
    name: "Masalas & Spices",
    slug: "masalas-spices",
    image: placeholder(
      "masalas-spices",
      "Bowls of chilli, turmeric and coriander powder with whole spices",
    ),
  },
  {
    name: "Instant Food Mixes",
    slug: "instant-food-mixes",
    image: placeholder(
      "instant-food-mixes",
      "Ready-to-cook mix pouches beside a bowl of traditional mix",
    ),
  },
  {
    name: "Millet & Nutrition Powders",
    slug: "millet-nutrition-powders",
    image: placeholder(
      "millet-nutrition-powders",
      "Heap of millet grains and a brass bowl of ragi nutrition powder",
    ),
  },
] as const satisfies readonly Category[];

export type CategorySlug = (typeof categories)[number]["slug"];

/** Route for a category listing page. */
export const categoryHref = (slug: CategorySlug | string) => `/categories/${slug}`;

/** Base path shared by all category routes (used for active-link state). */
export const categoriesBasePath = "/categories";

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
