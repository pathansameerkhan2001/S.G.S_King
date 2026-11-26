/**
 * Site-wide content for S.G.S King.
 * Keep copy and links here so components stay presentation-only.
 * Product categories live in ./categories.ts (single source of truth).
 */

export const brand = {
  name: "S.G.S King",
  tagline: "Premium Dry Fruits & Nuts",
  location: "Kadapa, Rayalaseema",
  region: "Kadapa, Rayalaseema, Andhra Pradesh, India",
} as const;

/**
 * Image assets.
 *
 * TEMPORARY: both files were cropped from the design reference mockup.
 * Replace them with the original artwork, keeping the same paths
 * (or update the paths below):
 *  - Logo:  public/images/brand/sgs-king-logo.png  (square, transparent PNG/SVG, ≥ 400×400)
 *  - Hero:  public/images/hero/hero-dry-fruits.jpg (landscape ~4:3, ≥ 2000px wide)
 */
export const assets = {
  logo: {
    src: "/images/brand/sgs-king-logo.png",
    width: 372,
    height: 372,
    alt: "S.G.S King — Premium Dry Fruits",
  },
  hero: {
    src: "/images/hero/hero-dry-fruits.jpg",
    width: 972,
    height: 729,
    alt: "Brass bowls filled with almonds, cashews, pistachios and walnuts, surrounded by dates, dried apricots and golden raisins",
  },
} as const;

export type AnnouncementItem = {
  label: string;
  icon?: "truck" | "location";
  highlight?: boolean;
};

export const announcements: AnnouncementItem[] = [
  { label: "Pan India Delivery", icon: "truck" },
  { label: "Premium Quality Dry Fruits" },
  { label: "Handpicked & Hygienically Packed" },
  { label: "From Kadapa, Rayalaseema", icon: "location", highlight: true },
];

export type NavItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "categories"; label: string; href: string };

export const navigation: NavItem[] = [
  { kind: "link", label: "Home", href: "/" },
  { kind: "link", label: "Shop", href: "/shop" },
  { kind: "categories", label: "Categories", href: "/shop" },
  { kind: "link", label: "Our Story", href: "/about" },
  { kind: "link", label: "Contact", href: "/contact" },
];

export const routes = {
  shop: "/shop",
  ourStory: "/about",
  wishlist: "/wishlist",
  checkout: "/checkout",
  contact: "/contact",
  account: "/account",
  cart: "/cart",
  search: "/search",
} as const;

export const hero = {
  eyebrow: "Premium Dry Fruits & Nuts",
  headingLine1: "Nature’s Goodness",
  headingLine2: "from Rayalaseema",
  description:
    "A premium selection of handpicked dry fruits, nuts and seeds, packed with purity, freshness and natural nutrition.",
  primaryCta: { label: "Explore Dry Fruits", href: "/shop" },
} as const;

export const collectionsSection = {
  eyebrow: "Shop by Category",
  heading: "Our Collections",
  description:
    "Traditional favourites from Rayalaseema, made with care and packed fresh for your home.",
} as const;
