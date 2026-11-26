/**
 * Sweets & Chikkis catalogue (frontend demo data).
 *
 * All data for the homepage "Sweets & Chikkis" section lives here, in the
 * shape the future admin panel / database will provide.
 *
 * DEMO DATA: products, prices and weights are temporary placeholders.
 * Images reuse the collection illustrations until real photos are uploaded.
 * `ingredients` is intentionally left undefined: never invent ingredient
 * lists; the Quick View only shows ingredients when real data is provided.
 * There are no ratings or reviews; never add invented ones.
 */

export type SweetCategory = "chikkis" | "laddus" | "traditional-sweets" | "jaggery-treats";

export const sweetFilters: { id: SweetCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "chikkis", label: "Chikkis" },
  { id: "laddus", label: "Laddus" },
  { id: "traditional-sweets", label: "Traditional Sweets" },
  { id: "jaggery-treats", label: "Jaggery Treats" },
];

export type SweetBadge =
  | "Homemade"
  | "Traditional Favourite"
  | "Popular"
  | "Freshly Packed"
  | "New Arrival";

export type SweetVariant = {
  id: string;
  /** Weight / size label, e.g. "250 g". */
  label: string;
  price: number;
  mrp?: number;
};

export type SweetProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** First entry is the primary category; a product may appear under several filters. */
  categories: SweetCategory[];
  image: { src: string; alt: string; fit?: "contain" | "cover" } | null;
  /** First variant is the default shown on the card. */
  variants: SweetVariant[];
  badge?: SweetBadge;
  /** Real ingredient list only. Leave undefined until confirmed. */
  ingredients?: string[];
  availability: "in_stock" | "low_stock" | "out_of_stock";
  displayOrder: number;
};

const chikkiImage = (alt: string) => ({ src: "/images/collections/sweets-chikkis.svg", alt, fit: "cover" as const });
const ladduImage = (alt: string) => ({ src: "/images/collections/traditional-laddus.svg", alt, fit: "cover" as const });

const sweets: SweetProduct[] = [
  {
    id: "sweet-peanut-chikki",
    slug: "peanut-chikki",
    name: "Peanut Chikki",
    description: "Traditional peanut and jaggery treat with a satisfying crunch.",
    categories: ["chikkis", "jaggery-treats"],
    image: chikkiImage("Peanut chikki bars"),
    variants: [
      { id: "250g", label: "250 g", price: 269, mrp: 299 },
      { id: "500g", label: "500 g", price: 499, mrp: 579 },
    ],
    badge: "Popular",
    availability: "in_stock",
    displayOrder: 1,
  },
  {
    id: "sweet-sesame-til-chikki",
    slug: "sesame-til-chikki",
    name: "Sesame Til Chikki",
    description: "Toasted sesame set in a classic, sweet traditional flavour.",
    categories: ["chikkis", "jaggery-treats"],
    image: chikkiImage("Sesame til chikki"),
    variants: [
      { id: "200g", label: "200 g", price: 229, mrp: 259 },
      { id: "400g", label: "400 g", price: 429, mrp: 499 },
    ],
    badge: "Traditional Favourite",
    availability: "in_stock",
    displayOrder: 2,
  },
  {
    id: "sweet-dry-fruit-laddu",
    slug: "traditional-dry-fruit-laddu",
    name: "Traditional Dry Fruit Laddu",
    description: "A rich, nutty traditional sweet packed with dry fruits.",
    categories: ["laddus"],
    image: ladduImage("Dry fruit laddus on a brass plate"),
    variants: [
      { id: "250g", label: "250 g", price: 399, mrp: 449 },
      { id: "500g", label: "500 g", price: 749, mrp: 849 },
    ],
    badge: "Homemade",
    availability: "in_stock",
    displayOrder: 3,
  },
  {
    id: "sweet-coconut-sweet",
    slug: "coconut-sweet",
    name: "Coconut Sweet",
    description: "A soft, traditional coconut-based sweet made in small batches.",
    categories: ["traditional-sweets"],
    image: chikkiImage("Traditional coconut sweets"),
    variants: [{ id: "250g", label: "250 g", price: 249, mrp: 279 }],
    badge: "Freshly Packed",
    availability: "in_stock",
    displayOrder: 4,
  },
  {
    id: "sweet-besan-laddu",
    slug: "besan-laddu",
    name: "Besan Laddu",
    description: "Melt-in-the-mouth gram flour laddus, a festive classic.",
    categories: ["laddus", "traditional-sweets"],
    image: ladduImage("Besan laddus"),
    variants: [
      { id: "250g", label: "250 g", price: 299 },
      { id: "500g", label: "500 g", price: 569 },
    ],
    badge: "Traditional Favourite",
    availability: "in_stock",
    displayOrder: 5,
  },
  {
    id: "sweet-jaggery-groundnut-laddu",
    slug: "jaggery-groundnut-laddu",
    name: "Jaggery Groundnut Laddu",
    description: "Roasted groundnuts bound with jaggery into wholesome laddus.",
    categories: ["laddus", "jaggery-treats"],
    image: ladduImage("Jaggery groundnut laddus"),
    variants: [{ id: "250g", label: "250 g", price: 279, mrp: 319 }],
    badge: "New Arrival",
    availability: "low_stock",
    displayOrder: 6,
  },
];

export const sweetsAndChikkis: SweetProduct[] = [...sweets].sort(
  (a, b) => a.displayOrder - b.displayOrder,
);

export const sweetsSection = {
  eyebrow: "Traditional Treats",
  heading: "Sweets & Chikkis",
  subtitle: "Sweet Memories, Made the Traditional Way",
} as const;

/** Unique id for a product + variant pair (used for cart lines and wishlist). */
export const variantKey = (product: SweetProduct, variant: SweetVariant) => `${product.id}:${variant.id}`;
