/**
 * Brand-quality tags shown in the strip directly below the hero.
 *
 * Edit, reorder (`order`) or toggle (`enabled`) tags here.
 *
 * IMPORTANT: tags with `requiresVerification: true` make factual product
 * claims (organic, preservative-free, …). They are disabled by default.
 * Only set `enabled: true` once the claim is verified for EVERY product
 * sold on the site (and any required certification is in place).
 */

export type QualityTagIcon =
  | "heart"
  | "leaf"
  | "scroll"
  | "hand-heart"
  | "package"
  | "droplet"
  | "sprout"
  | "shield"
  | "flask-off";

export type QualityTag = {
  id: string;
  label: string;
  icon: QualityTagIcon;
  enabled: boolean;
  order: number;
  /** True for factual claims that must be verified before enabling. */
  requiresVerification?: boolean;
};

const qualityTags: QualityTag[] = [
  { id: "homemade", label: "Homemade with Love", icon: "heart", enabled: true, order: 1 },
  { id: "natural-ingredients", label: "Natural Ingredients", icon: "leaf", enabled: true, order: 2 },
  { id: "traditional-recipes", label: "Traditional Recipes", icon: "scroll", enabled: true, order: 3 },
  // Requested by the business owner (2026-11-26). Keep enabled only while every
  // product described by this site-wide tag is genuinely made with pure ghee.
  { id: "pure-ghee", label: "Made with Pure Ghee", icon: "droplet", enabled: true, order: 4 },
  { id: "freshly-packed", label: "Freshly Packed", icon: "package", enabled: true, order: 5 },
  // Replaced by "Made with Pure Ghee" in the 5-tag line-up; re-enable if wanted.
  { id: "made-with-care", label: "Made with Care", icon: "hand-heart", enabled: false, order: 9 },

  // Claims: keep disabled until verified for all products.
  { id: "organic", label: "100% Organic", icon: "sprout", enabled: false, order: 6, requiresVerification: true },
  { id: "preservative-free", label: "No Preservatives", icon: "shield", enabled: false, order: 7, requiresVerification: true },
  { id: "chemical-free", label: "Chemical-Free", icon: "flask-off", enabled: false, order: 8, requiresVerification: true },
];

export const activeQualityTags = qualityTags
  .filter((tag) => tag.enabled)
  .sort((a, b) => a.order - b.order);
