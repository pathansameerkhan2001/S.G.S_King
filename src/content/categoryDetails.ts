/**
 * Category page copy (admin-managed later). Kept separate from the shared
 * category list (names/slugs/images in categories.ts) so navigation data
 * stays small. Descriptions describe the product type only; no factual
 * claims (organic, preservative-free, etc.) are made here.
 */
import type { CategorySlug } from "./categories";

export const categoryDetails: Record<CategorySlug, { tagline: string; description: string }> = {
  "traditional-laddus": {
    tagline: "Festive classics, rolled by hand",
    description:
      "Round, golden and full of memories: our laddus follow the traditional recipes of Rayalaseema homes, made in small batches for festivals, gifting and everyday sweet cravings.",
  },
  "honey-blends": {
    tagline: "Golden sweetness from nature",
    description:
      "Natural honey and honey blends for your morning lemon water, desserts and wholesome breakfasts, packed carefully to keep their flavour.",
  },
  "sweets-chikkis": {
    tagline: "Crunchy, chewy, comforting",
    description:
      "Jaggery-set chikkis and traditional sweets with the crunch and flavour you remember from childhood: perfect with tea, for travel, or as a thoughtful gift.",
  },
  "roasted-nuts-snacks": {
    tagline: "Snack the traditional way",
    description:
      "Roasted nuts and savoury snacks for tea-time, lunch boxes and long journeys, seasoned the way Rayalaseema likes it.",
  },
  "masalas-spices": {
    tagline: "The heart of the Andhra kitchen",
    description:
      "Everyday spice powders and masala blends that bring bold Andhra flavour to curries, sambar, rasam and fries.",
  },
  "instant-food-mixes": {
    tagline: "Traditional breakfasts in minutes",
    description:
      "Ready-to-cook mixes for South Indian favourites, made for busy mornings without giving up homestyle taste.",
  },
  "millet-nutrition-powders": {
    tagline: "Grains our grandparents trusted",
    description:
      "Millet grains and nutrition powders for porridges, malts and rotis, bringing traditional grains back to the family table.",
  },
};
