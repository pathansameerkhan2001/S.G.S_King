/**
 * About page content (admin-managed later).
 * Only facts provided by the business are stated. Items in [square
 * brackets] are placeholders that MUST be replaced with real information;
 * the page shows them in a visibly marked "to be added" style.
 */

export const about = {
  hero: {
    eyebrow: "Our Story",
    title: "Tradition, Made with Love",
    description:
      "S.G.S King Foods brings the authentic taste of tradition from Kadapa, Rayalaseema to homes across India: carefully prepared, thoughtfully packed and delivered with love.",
  },
  intro: {
    title: "Who We Are",
    paragraphs: [
      "S.G.S King Foods is a traditional food brand from Kadapa in the Rayalaseema region of Andhra Pradesh. We make and bring you the sweets, laddus, chikkis, honey, masalas, snacks, instant mixes and millet products that have always been part of family kitchens here.",
      "Every product is prepared with care, handpicked ingredients and the patience that traditional recipes deserve.",
    ],
  },
  story: {
    title: "Our Story",
    /** Placeholder: the founders' real story, in their words. */
    placeholder: "[Founder story to be added: how S.G.S King Foods began, who started it, and why.]",
  },
  roots: {
    title: "Rooted in Kadapa, Rayalaseema",
    paragraphs: [
      "Rayalaseema is a land of rugged hills, historic forts and rich culinary traditions. Its food is bold, honest and made to be shared.",
      "Our recipes carry that spirit: familiar flavours from the region, made the way they have been made in local homes for generations.",
    ],
  },
  values: [
    {
      icon: "scroll" as const,
      title: "Traditional Recipes",
      text: "We follow time-honoured family recipes and preparation methods, without shortcuts.",
    },
    {
      icon: "leaf" as const,
      title: "Handpicked Ingredients",
      text: "Ingredients are selected with care before they reach our kitchen.",
    },
    {
      icon: "package" as const,
      title: "Hygienically Packed",
      text: "Products are packed carefully to keep them fresh until they reach you.",
    },
    {
      icon: "heart" as const,
      title: "Made with Love",
      text: "Every pack is prepared the way we would prepare it for our own family.",
    },
  ],
  commitment: {
    title: "Our Commitment to You",
    points: [
      "Honest food, made in small batches with traditional methods.",
      "Careful packing so your order arrives fresh.",
      "Friendly support on WhatsApp, phone and email.",
      "Pan India delivery from Kadapa to your doorstep.",
    ],
  },
  cta: {
    title: "Taste the Tradition",
    text: "Explore laddus, chikkis, honey, masalas and more, made the Rayalaseema way.",
  },
} as const;
