import { z } from "zod";

/**
 * Validation schemas and types for admin-managed data.
 * Server actions validate ALL input against these before writing.
 * (Pure module: also imported for types by client form components.)
 */

const slug = z
  .string()
  .trim()
  .min(2, "At least 2 characters")
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only");
const rupees = z.coerce.number().int("Whole rupees only").min(0).max(1_000_000);
const optionalRupees = z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : v), rupees.optional());
const text = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) => z.preprocess((v) => (v === "" ? undefined : v), text(max).optional());
/** S3 object key inside the media/ prefix. */
export const mediaKey = z.string().regex(/^media\/[a-z]+\/\d{4}\/\d{2}\/[a-zA-Z0-9-]+\.(jpg|jpeg|png|webp|avif|gif)$/, "Invalid media reference");

export const availability = z.enum(["in_stock", "low_stock", "out_of_stock"]);

// ---------------------------------------------------------------- categories
export const categoryInput = z.object({
  categoryId: slug,
  name: text(80).min(2, "Name is required"),
  description: text(1000).default(""),
  imageKey: mediaKey.optional(),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(0),
  visible: z.boolean().default(true),
});
export type CategoryInput = z.infer<typeof categoryInput>;
export type Category = CategoryInput & { createdAt: string; updatedAt: string; version: number };

// ---------------------------------------------------------------- products
export const variantInput = z
  .object({
    id: z.string().trim().regex(/^[a-z0-9-]{1,30}$/, "Variant id: lowercase letters, numbers, hyphens"),
    label: text(40).min(1, "Size label is required"),
    price: rupees,
    mrp: optionalRupees,
    stock: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : v), z.coerce.number().int().min(0).max(100000).optional()),
  })
  .refine((v) => v.mrp === undefined || v.mrp >= v.price, { message: "Original price must be ≥ selling price", path: ["mrp"] });

export const productInput = z.object({
  name: text(120).min(2, "Name is required"),
  slug,
  description: text(4000).default(""),
  categoryId: slug,
  variants: z.array(variantInput).min(1, "Add at least one size").max(12),
  images: z.array(mediaKey).max(12).default([]),
  badge: optionalText(40),
  ingredients: optionalText(2000),
  storage: optionalText(1000),
  availability: availability.default("in_stock"),
  isBestseller: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  visible: z.boolean().default(true),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(100),
});
export type ProductInput = z.infer<typeof productInput>;
export type Product = ProductInput & { productId: string; createdAt: string; updatedAt: string; version: number };

// ---------------------------------------------------------------- combos
export const comboInput = z
  .object({
    name: text(120).min(2, "Name is required"),
    slug,
    description: text(4000).default(""),
    items: z
      .array(z.object({ productId: z.string().regex(/^prd_[a-z0-9]+$/), quantity: z.coerce.number().int().min(1).max(50) }))
      .min(1, "Add at least one product"),
    price: rupees,
    mrp: optionalRupees,
    packSize: optionalText(40),
    badge: optionalText(40),
    images: z.array(mediaKey).max(12).default([]),
    availability: availability.default("in_stock"),
    isFeatured: z.boolean().default(false),
    visible: z.boolean().default(true),
    displayOrder: z.coerce.number().int().min(0).max(9999).default(100),
  })
  .refine((v) => v.mrp === undefined || v.mrp >= v.price, { message: "Original price must be ≥ combo price", path: ["mrp"] });
export type ComboInput = z.infer<typeof comboInput>;
export type Combo = ComboInput & { comboId: string; createdAt: string; updatedAt: string; version: number };

// ---------------------------------------------------------------- orders
export const orderStatuses = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"] as const;
export const paymentStatuses = ["pending", "paid", "failed", "refunded"] as const;
export type OrderStatus = (typeof orderStatuses)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];

export type OrderItem = { productId?: string; comboId?: string; name: string; variant?: string; quantity: number; unitPrice: number; lineTotal: number };
export type OrderTimelineEntry = { at: string; status?: OrderStatus; payment?: PaymentStatus; note?: string; by?: string };
export type Order = {
  orderId: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  status: OrderStatus;
  payment: { method: "cod" | "online"; status: PaymentStatus; reference?: string };
  customer: { name: string; phone: string; email?: string };
  shipping: { house: string; street: string; area: string; city: string; state: string; pincode: string; landmark?: string; addressType?: string };
  items: OrderItem[];
  totals: { subtotal: number; discount: number; delivery: number; total: number };
  couponCode?: string;
  notes?: string;
  timeline: OrderTimelineEntry[];
};

export const orderUpdateInput = z.object({
  status: z.enum(orderStatuses),
  paymentStatus: z.enum(paymentStatuses),
  paymentReference: optionalText(120),
  note: optionalText(500),
});

// ---------------------------------------------------------------- settings / homepage / reviews / coupons
export const settingsInput = z.object({
  storeName: text(80).min(2),
  email: z.email().max(120),
  phones: z.array(z.string().regex(/^[6-9]\d{9}$/, "10-digit Indian mobile")).min(1).max(4),
  whatsapp: z.string().regex(/^[6-9]\d{9}$/, "10-digit Indian mobile"),
  whatsappGreeting: text(300).default(""),
  addressLines: z.array(text(160)).min(1).max(5),
  businessHours: z.array(z.object({ days: text(60).min(1), hours: text(60).min(1) })).max(7).default([]),
  deliveryFee: optionalRupees,
  freeDeliveryAbove: optionalRupees,
  codEnabled: z.boolean().default(false),
  announcement: z.array(text(80)).max(6).default([]),
});
export type StoreSettings = z.infer<typeof settingsInput>;

export const promoSection = z.object({
  id: z.string().regex(/^[a-z0-9-]{1,40}$/),
  title: text(120).min(1),
  text: text(600).default(""),
  ctaLabel: optionalText(40),
  ctaHref: z.preprocess((v) => (v === "" ? undefined : v), z.string().regex(/^\/[a-zA-Z0-9\-/?=&#]*$/, "Must be a site path starting with /").max(200).optional()),
  imageKey: mediaKey.optional(),
  visible: z.boolean().default(true),
  order: z.coerce.number().int().min(0).max(999).default(0),
});
export const homepageInput = z.object({
  hero: z.object({ eyebrow: text(80), heading: text(120).min(1), subheading: text(400), ctaLabel: text(40), ctaHref: z.string().regex(/^\/[a-zA-Z0-9\-/?=&#]*$/).max(200), imageKey: mediaKey.optional() }),
  featuredProductIds: z.array(z.string().regex(/^prd_[a-z0-9]+$/)).max(24).default([]),
  collectionOrder: z.array(slug).max(30).default([]),
  promoSections: z.array(promoSection).max(12).default([]),
});
export type HomepageConfig = z.infer<typeof homepageInput>;

export const reviewInput = z.object({
  id: z.string().regex(/^rev_[a-z0-9]+$/),
  customerName: text(80).min(1),
  location: optionalText(80),
  text: text(2000).min(5),
  rating: z.coerce.number().int().min(1).max(5),
  imageKey: mediaKey.optional(),
  /** Set only by the server, and only when orderId refers to an existing order. */
  orderId: optionalText(60),
  approved: z.boolean().default(false),
  visible: z.boolean().default(false),
  displayOrder: z.coerce.number().int().min(0).max(9999).default(100),
});
export type Review = z.infer<typeof reviewInput> & { verifiedPurchase: boolean; createdAt: string; updatedAt: string };

export const couponInput = z
  .object({
    code: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{3,20}$/, "3–20 letters/numbers"),
    type: z.enum(["percent", "fixed"]),
    value: z.coerce.number().int().min(1).max(100000),
    minOrder: optionalRupees,
    maxUses: z.preprocess((v) => (v === "" ? undefined : v), z.coerce.number().int().min(1).max(1_000_000).optional()),
    perCustomerLimit: z.preprocess((v) => (v === "" ? undefined : v), z.coerce.number().int().min(1).max(100).optional()),
    startsAt: optionalText(30),
    endsAt: optionalText(30),
    active: z.boolean().default(true),
  })
  .refine((c) => c.type !== "percent" || c.value <= 90, { message: "Percentage discounts are capped at 90%", path: ["value"] })
  .refine((c) => !c.startsAt || !c.endsAt || c.startsAt <= c.endsAt, { message: "End date must be after start date", path: ["endsAt"] });
export type Coupon = z.infer<typeof couponInput> & { usedCount: number; createdAt: string; updatedAt: string };

/** Formats zod errors as { field: message } for forms. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
