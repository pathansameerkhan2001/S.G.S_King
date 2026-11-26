/**
 * Unified catalogue: normalises products, sweets and combos into one model
 * used by the shop, category, search, product/combo detail, cart, wishlist
 * and checkout. Source data stays in src/content/*; nothing is duplicated.
 *
 * FUTURE: replace the three source arrays with admin/API data that
 * produces the same `CatalogItem` shape.
 */

import { categories, categoryHref, type CategorySlug } from "@/content/categories";
import { comboHref, featuredCombos, type ComboItem } from "@/content/combos";
import { productHref, products, type ProductFaq, type ProductImage } from "@/content/products";
import { sweetsAndChikkis } from "@/content/sweets";

export type CatalogKind = "product" | "combo";

export type CatalogVariant = {
  id: string;
  label: string;
  price: number;
  mrp?: number;
  /** Units in stock when known. */
  stock?: number;
};

export type Availability = "in_stock" | "low_stock" | "out_of_stock";

export type CatalogItem = {
  /** Stable key used by cart and wishlist: `${kind}:${slug}`. */
  key: string;
  kind: CatalogKind;
  slug: string;
  name: string;
  description?: string;
  href: string;
  categorySlug: CategorySlug | null;
  images: ProductImage[];
  variants: CatalogVariant[];
  badge?: string;
  availability: Availability;
  isBestseller: boolean;
  displayOrder: number;
  addedOn?: string;
  ingredients?: string[];
  storage?: string;
  nutrition?: { label: string; value: string }[];
  faqs?: ProductFaq[];
  includedItems?: ComboItem[];
  packSize?: string;
  isDemo?: boolean;
};

export const itemKey = (kind: CatalogKind, slug: string) => `${kind}:${slug}`;

function build(): CatalogItem[] {
  const bySlug = new Map<string, CatalogItem>();

  for (const p of products) {
    const variants: CatalogVariant[] = p.variants?.length
      ? p.variants
      : [{ id: "default", label: p.variant, price: p.price, mrp: p.mrp }];
    bySlug.set(p.slug, {
      key: itemKey("product", p.slug),
      kind: "product",
      slug: p.slug,
      name: p.name,
      description: p.description,
      href: productHref(p.slug),
      categorySlug: p.categorySlug,
      images: [p.image, ...(p.gallery ?? [])].filter((x): x is ProductImage => x !== null),
      variants,
      badge: p.badge ?? (p.isBestseller ? "Bestseller" : undefined),
      availability: p.availability ?? "in_stock",
      isBestseller: p.isBestseller,
      displayOrder: p.displayOrder ?? 100,
      addedOn: p.addedOn,
      ingredients: p.ingredients,
      storage: p.storage,
      nutrition: p.nutrition,
      faqs: p.faqs,
      isDemo: p.isDemo,
    });
  }

  // Sweets & Chikkis: merge into an existing product with the same slug
  // (richer sizes/description win), otherwise add as a new product.
  for (const s of sweetsAndChikkis) {
    const existing = bySlug.get(s.slug);
    const merged: CatalogItem = {
      key: itemKey("product", s.slug),
      kind: "product",
      slug: s.slug,
      name: s.name,
      description: s.description,
      href: productHref(s.slug),
      categorySlug: s.categorySlug,
      images: s.image ? [s.image] : existing?.images ?? [],
      variants: s.variants,
      badge: s.badge ?? existing?.badge,
      availability: s.availability,
      isBestseller: existing?.isBestseller ?? false,
      displayOrder: existing?.displayOrder ?? 20 + s.displayOrder,
      addedOn: existing?.addedOn ?? "2026-11-01",
      ingredients: s.ingredients ?? existing?.ingredients,
      storage: existing?.storage,
      nutrition: existing?.nutrition,
      faqs: existing?.faqs,
      isDemo: true,
    };
    bySlug.set(s.slug, merged);
  }

  const comboItems: CatalogItem[] = featuredCombos.map((c) => ({
    key: itemKey("combo", c.slug),
    kind: "combo",
    slug: c.slug,
    name: c.name,
    description: c.description,
    href: comboHref(c.slug),
    categorySlug: null,
    images: c.image ? [c.image] : [],
    variants: [{ id: "default", label: c.packSize ?? `${c.includedItems.length} items`, price: c.price, mrp: c.mrp }],
    badge: c.badge,
    availability: c.availability,
    isBestseller: false,
    displayOrder: 50 + c.displayOrder,
    addedOn: "2026-11-01",
    includedItems: c.includedItems,
    packSize: c.packSize,
    isDemo: true,
  }));

  return [...bySlug.values(), ...comboItems];
}

export const catalog: CatalogItem[] = build();
export const catalogProducts = catalog.filter((i) => i.kind === "product");
export const catalogCombos = catalog.filter((i) => i.kind === "combo");

const byKey = new Map(catalog.map((i) => [i.key, i]));
export const getItemByKey = (key: string) => byKey.get(key);
export const getProduct = (slug: string) => byKey.get(itemKey("product", slug));
export const getCombo = (slug: string) => byKey.get(itemKey("combo", slug));

export const getVariant = (item: CatalogItem, variantId?: string) =>
  item.variants.find((v) => v.id === variantId) ?? item.variants[0];

/** Lowest selling price across sizes (used for sorting and price filters). */
export const fromPrice = (item: CatalogItem) => Math.min(...item.variants.map((v) => v.price));

export const itemsInCategory = (slug: string) => catalogProducts.filter((i) => i.categorySlug === slug);

export const categoryName = (slug: CategorySlug | null) =>
  slug ? categories.find((c) => c.slug === slug)?.name : undefined;

export { categoryHref };

// ---------------------------------------------------------------- search

const normalise = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const haystack = (item: CatalogItem) =>
  normalise(
    [item.name, item.description, categoryName(item.categorySlug), item.badge, ...(item.includedItems?.map((x) => x.name) ?? [])]
      .filter(Boolean)
      .join(" "),
  );

/** True when every word of the query appears (prefix match) in the item text. */
export function matchesQuery(item: CatalogItem, query: string) {
  const words = normalise(query).split(" ").filter(Boolean);
  if (words.length === 0) return true;
  const text = haystack(item);
  const tokens = text.split(" ");
  return words.every((w) => text.includes(w) || tokens.some((t) => t.startsWith(w)));
}

export function searchCategories(query: string) {
  const q = normalise(query);
  if (!q) return [];
  return categories.filter((c) => normalise(c.name).includes(q) || q.split(" ").every((w) => normalise(c.name).includes(w)));
}

// ---------------------------------------------------------------- sorting

export type SortKey = "featured" | "price-asc" | "price-desc" | "newest" | "name";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name: A–Z" },
];

export function sortItems(items: CatalogItem[], sort: SortKey) {
  const list = [...items];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => fromPrice(a) - fromPrice(b));
    case "price-desc":
      return list.sort((a, b) => fromPrice(b) - fromPrice(a));
    case "newest":
      return list.sort((a, b) => (b.addedOn ?? "").localeCompare(a.addedOn ?? "") || a.displayOrder - b.displayOrder);
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return list.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller) || a.displayOrder - b.displayOrder);
  }
}

/** Related items: same category first, then other items of the same kind. */
export function relatedItems(item: CatalogItem, limit = 4) {
  const sameCategory = catalog.filter(
    (i) => i.key !== item.key && i.kind === item.kind && item.categorySlug && i.categorySlug === item.categorySlug,
  );
  const others = sortItems(
    catalog.filter((i) => i.key !== item.key && i.kind === item.kind && !sameCategory.includes(i)),
    "featured",
  );
  return [...sameCategory, ...others].slice(0, limit);
}

/** Catalogue products matching a combo's included item names. */
export function productsInCombo(combo: CatalogItem) {
  const names = new Set((combo.includedItems ?? []).map((x) => normalise(x.name)));
  return catalogProducts.filter((p) => names.has(normalise(p.name)));
}
