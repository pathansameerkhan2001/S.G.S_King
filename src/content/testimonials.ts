/**
 * Customer testimonials, in the shape the future admin panel will manage.
 *
 * DEMO CONTENT: the entries below are design placeholders, NOT real
 * customer reviews. They are flagged `isDemo: true`, which makes the card
 * show a "Sample review" label instead of a verified badge. Replace them
 * with real reviews (and screenshots) before launch; never mark demo
 * content as verified.
 */

export type Testimonial = {
  id: string;
  /** Customer name, or a short review category shown at the bottom of the card. */
  customerName: string;
  /** Optional customer location, e.g. "Hyderabad". */
  location?: string;
  reviewText: string;
  /** Uploaded review screenshot / photo. null shows the placeholder. */
  reviewImage: { src: string; alt: string } | null;
  /** 1–5 */
  rating: number;
  verified: boolean;
  active: boolean;
  displayOrder: number;
  /** True for placeholder content used during development. */
  isDemo?: boolean;
};

const testimonials: Testimonial[] = [
  {
    id: "demo-1",
    customerName: "Family Favourite",
    reviewText: "Sample review: the traditional laddus tasted just like home.",
    reviewImage: null,
    rating: 5,
    verified: false,
    active: true,
    displayOrder: 1,
    isDemo: true,
  },
  {
    id: "demo-2",
    customerName: "Festive Gifting",
    reviewText: "Sample review: beautifully packed and perfect for gifting.",
    reviewImage: null,
    rating: 5,
    verified: false,
    active: true,
    displayOrder: 2,
    isDemo: true,
  },
  {
    id: "demo-3",
    customerName: "Repeat Customer",
    reviewText: "Sample review: fresh chikkis and quick delivery every time.",
    reviewImage: null,
    rating: 5,
    verified: false,
    active: true,
    displayOrder: 3,
    isDemo: true,
  },
  {
    id: "demo-4",
    customerName: "Quick Delivery",
    reviewText: "Sample review: great quality and authentic Rayalaseema taste.",
    reviewImage: null,
    rating: 5,
    verified: false,
    active: true,
    displayOrder: 4,
    isDemo: true,
  },
];

export const activeTestimonials = testimonials
  .filter((t) => t.active)
  .sort((a, b) => a.displayOrder - b.displayOrder);

export const testimonialsSection = {
  heading: "Loved by Thousands of Food Lovers",
} as const;
