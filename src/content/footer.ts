/**
 * Footer navigation config.
 *
 * Only links with an `href` are rendered, so the footer never points to a
 * page that doesn't exist. When a page is built, add its `href` here.
 * Homepage section links use the existing section heading ids as anchors.
 */

import { categoryHref, type Category } from "./categories";

export type FooterLinkIcon = "home" | "shop" | "collections" | "star" | "gift" | "sweets" | "story";

export type FooterLink = { label: string; href?: string; icon: FooterLinkIcon };

export const exploreLinks: FooterLink[] = [
  { label: "Home", href: "/", icon: "home" },
  // No /shop page yet: "Shop All" points to the collections on the homepage.
  { label: "Shop All", href: "/#collections-heading", icon: "shop" },
  { label: "Our Collections", href: "/#collections-heading", icon: "collections" },
  { label: "Best Sellers", href: "/#best-sellers-heading", icon: "star" },
  { label: "Combo Products", href: "/#combo-products-heading", icon: "gift" },
  { label: "Sweets & Chikkis", href: "/#sweets-heading", icon: "sweets" },
  // Hidden until the Our Story page exists. Set href: "/our-story" then.
  { label: "Our Story", href: undefined, icon: "story" },
];

/**
 * Category pages (/categories/[slug]) are not built yet. While false, footer
 * category links go to the Our Collections section instead of a 404.
 * Flip to true once the category pages exist.
 */
export const CATEGORY_PAGES_LIVE = false;

export const footerCategoryHref = (category: Pick<Category, "slug">) =>
  CATEGORY_PAGES_LIVE ? categoryHref(category.slug) : "/#collections-heading";

/** Policy pages: hidden until each page exists. Add the href when ready. */
export const policyLinks: { label: string; href?: string }[] = [
  { label: "Privacy Policy", href: undefined },
  { label: "Terms & Conditions", href: undefined },
  { label: "Shipping & Delivery", href: undefined },
  { label: "Returns & Refunds", href: undefined },
];

export const footerCopy = {
  description:
    "Bringing the authentic taste of tradition from Rayalaseema to your home. Carefully prepared, thoughtfully packed, and delivered with love.",
  tagline: "Tradition in Every Bite. Goodness in Every Pack.",
} as const;
