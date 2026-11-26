/**
 * Combo products: gift boxes, family packs and value bundles.
 *
 * All combo data lives here; components only receive `ComboProduct`
 * objects. The shape mirrors what the future admin panel / database will
 * provide, so this array can later be swapped for an API response.
 *
 * DEMO DATA: every combo, price and included item below is a temporary
 * placeholder for development. Images reuse the collection illustrations
 * until real combo photos are uploaded via the admin panel. There are no
 * ratings or reviews on combos; never add invented ones.
 */

import { discountPercent } from "./products";

export type ComboBadge =
  | "Popular Combo"
  | "Best Value"
  | "Family Pack"
  | "Festive Special"
  | "Healthy Choice";

export type ComboAvailability = "in_stock" | "low_stock" | "out_of_stock";

export type ComboImage = {
  src: string;
  alt: string;
  fit?: "contain" | "cover";
};

export type ComboItem = {
  name: string;
  /** e.g. "250 g", "2 × 200 g" */
  quantity?: string;
};

export type ComboProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: ComboImage | null;
  /** Selling price in whole rupees. */
  price: number;
  /** Original price in whole rupees. */
  mrp?: number;
  badge?: ComboBadge;
  includedItems: ComboItem[];
  /** Total weight or pack size, e.g. "1 kg" or "4 items". */
  packSize?: string;
  availability: ComboAvailability;
  /** Lower numbers are shown first. */
  displayOrder: number;
};

const combos: ComboProduct[] = [
  {
    id: "combo-royal-dry-fruit",
    slug: "royal-dry-fruit-combo",
    name: "Royal Dry Fruit Combo",
    description: "Premium almonds, cashews, pistachios and walnuts in one gift-ready box.",
    image: {
      src: "/images/collections/roasted-nuts-snacks.svg",
      alt: "Brass bowl of mixed dry fruits and nuts",
      fit: "cover",
    },
    price: 899,
    mrp: 1049,
    badge: "Best Value",
    includedItems: [
      { name: "Almonds", quantity: "200 g" },
      { name: "Cashews", quantity: "200 g" },
      { name: "Pistachios", quantity: "100 g" },
      { name: "Walnuts", quantity: "100 g" },
    ],
    packSize: "600 g",
    availability: "in_stock",
    displayOrder: 1,
  },
  {
    id: "combo-traditional-sweet",
    slug: "traditional-sweet-combo",
    name: "Traditional Sweet Combo",
    description: "Classic laddus and crunchy chikkis, made the Rayalaseema way.",
    image: {
      src: "/images/collections/traditional-laddus.svg",
      alt: "Assorted traditional laddus on a brass plate",
      fit: "cover",
    },
    price: 599,
    mrp: 749,
    badge: "Popular Combo",
    includedItems: [
      { name: "Traditional Laddus", quantity: "250 g" },
      { name: "Peanut Chikki", quantity: "200 g" },
      { name: "Sesame Chikki", quantity: "150 g" },
    ],
    packSize: "600 g",
    availability: "in_stock",
    displayOrder: 2,
  },
  {
    id: "combo-healthy-snack",
    slug: "healthy-snack-combo",
    name: "Healthy Snack Combo",
    description: "Roasted nuts and millet goodness for guilt-free everyday snacking.",
    image: {
      src: "/images/collections/millet-nutrition-powders.svg",
      alt: "Millet grains and a bowl of nutrition powder",
      fit: "cover",
    },
    price: 699,
    mrp: 799,
    badge: "Healthy Choice",
    includedItems: [
      { name: "Roasted Mixed Nuts", quantity: "200 g" },
      { name: "Millet Nutrition Powder", quantity: "250 g" },
      { name: "Ragi Chikki", quantity: "150 g" },
    ],
    packSize: "600 g",
    availability: "in_stock",
    displayOrder: 3,
  },
  {
    id: "combo-festive-family",
    slug: "festive-family-pack",
    name: "Festive Family Pack",
    description: "A generous festive hamper of sweets, nuts and honey to share.",
    image: {
      src: "/images/collections/sweets-chikkis.svg",
      alt: "Chikki bars and diamond-cut sweets on a brass plate",
      fit: "cover",
    },
    price: 1299,
    mrp: 1599,
    badge: "Family Pack",
    includedItems: [
      { name: "Traditional Laddus", quantity: "500 g" },
      { name: "Peanut Chikki", quantity: "250 g" },
      { name: "Roasted Mixed Nuts", quantity: "250 g" },
      { name: "Pure Natural Honey", quantity: "250 g" },
    ],
    packSize: "1.25 kg",
    availability: "in_stock",
    displayOrder: 4,
  },
  {
    id: "combo-honey-wellness",
    slug: "honey-wellness-combo",
    name: "Honey Wellness Combo",
    description: "Pure honey paired with nutrition powder for a wholesome start to the day.",
    image: {
      src: "/images/collections/honey-blends.svg",
      alt: "Jar of natural honey with honeycomb",
      fit: "cover",
    },
    price: 749,
    mrp: 899,
    badge: "Healthy Choice",
    includedItems: [
      { name: "Pure Natural Honey", quantity: "500 g" },
      { name: "Millet Nutrition Powder", quantity: "250 g" },
    ],
    packSize: "750 g",
    availability: "in_stock",
    displayOrder: 5,
  },
  {
    id: "combo-masala-essentials",
    slug: "masala-essentials-combo",
    name: "Masala Essentials Combo",
    description: "Everyday Andhra masalas and spice powders for the home kitchen.",
    image: {
      src: "/images/collections/masalas-spices.svg",
      alt: "Bowls of chilli, turmeric and coriander powder",
      fit: "cover",
    },
    price: 449,
    mrp: 549,
    badge: "Festive Special",
    includedItems: [
      { name: "Chilli Powder", quantity: "200 g" },
      { name: "Turmeric Powder", quantity: "100 g" },
      { name: "Coriander Powder", quantity: "200 g" },
      { name: "Garam Masala", quantity: "100 g" },
    ],
    packSize: "600 g",
    availability: "low_stock",
    displayOrder: 6,
  },
];

/** Combos for the homepage carousel, in admin-defined order. */
export const featuredCombos: ComboProduct[] = [...combos].sort(
  (a, b) => a.displayOrder - b.displayOrder,
);

export const comboHref = (slug: string) => `/combos/${slug}`;

/** Discount % derived from price and MRP (never stored separately). */
export const comboDiscount = (combo: ComboProduct) => discountPercent(combo);

export const comboSection = {
  heading: "Combo Products",
  subtitle: "Perfect Pairings of Our Favourite Traditional Treats",
} as const;
