"use server";

import { randomBytes } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ActionState } from "@/components/admin/forms";
import { couponInput, fieldErrors, homepageInput, reviewInput, settingsInput, type Coupon, type Review } from "@/lib/admin/schemas";
import { readPayload } from "@/lib/server/admin-data";
import { requireAdmin } from "@/lib/server/auth";
import { actionError } from "@/lib/server/load";
import { getOrder, listProducts, listCategories } from "@/lib/server/repo/catalog";
import { readDoc, writeDoc } from "@/lib/server/repo/documents";

type DocPayload = { etag: string | null; data: unknown };
const invalid: ActionState = { ok: false, message: "Invalid form submission." };
const now = () => new Date().toISOString();

// ---------------------------------------------------------------- settings
export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const payload = readPayload<DocPayload>(formData);
  if (!payload) return invalid;
  const parsed = settingsInput.safeParse(payload.data);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };
  try {
    await writeDoc("settings", parsed.data, payload.etag);
  } catch (e) {
    return actionError(e);
  }
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=Store%20settings");
}

// ---------------------------------------------------------------- homepage
export async function saveHomepage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const payload = readPayload<DocPayload>(formData);
  if (!payload) return invalid;
  const parsed = homepageInput.safeParse(payload.data);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };
  try {
    const [products, categories] = await Promise.all([listProducts(), listCategories()]);
    const productIds = new Set(products.map((p) => p.productId));
    const categoryIds = new Set(categories.map((c) => c.categoryId));
    if (parsed.data.featuredProductIds.some((id) => !productIds.has(id))) return { ok: false, message: "A featured product no longer exists. Reload and try again." };
    if (parsed.data.collectionOrder.some((id) => !categoryIds.has(id))) return { ok: false, message: "A category in the collection order no longer exists. Reload and try again." };
    const ids = parsed.data.promoSections.map((s) => s.id);
    if (new Set(ids).size !== ids.length) return { ok: false, message: "Promotional section IDs must be unique." };
    await writeDoc("homepage", parsed.data, payload.etag);
  } catch (e) {
    return actionError(e);
  }
  revalidatePath("/admin/homepage");
  redirect("/admin/homepage?saved=Homepage");
}

// ---------------------------------------------------------------- reviews
export async function saveReview(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const payload = readPayload<{ etag: string | null; data: Record<string, unknown> }>(formData);
  if (!payload) return invalid;
  const id = typeof payload.data.id === "string" && payload.data.id ? payload.data.id : `rev_${randomBytes(6).toString("hex")}`;
  const parsed = reviewInput.safeParse({ ...payload.data, id });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };
  try {
    // Verified purchase is derived server-side: only true when linked to a real order.
    let verifiedPurchase = false;
    if (parsed.data.orderId) {
      if (!(await getOrder(parsed.data.orderId))) return { ok: false, errors: { orderId: "No order with this ID exists." }, message: "Please fix the highlighted fields." };
      verifiedPurchase = true;
    }
    const { data: reviews, etag } = await readDoc("reviews");
    if (etag !== payload.etag) return { ok: false, message: "Reviews were changed by someone else. Reload and try again." };
    const existing = reviews.find((r) => r.id === id);
    const review: Review = { ...parsed.data, verifiedPurchase, createdAt: existing?.createdAt ?? now(), updatedAt: now() };
    const next = existing ? reviews.map((r) => (r.id === id ? review : r)) : [...reviews, review];
    await writeDoc("reviews", next, etag);
  } catch (e) {
    return actionError(e);
  }
  revalidatePath("/admin/reviews");
  redirect(`/admin/reviews?saved=${encodeURIComponent(parsed.data.customerName)}`);
}

export async function removeReview(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  let error: string | undefined;
  try {
    const { data, etag } = await readDoc("reviews");
    await writeDoc("reviews", data.filter((r) => r.id !== id), etag);
  } catch (e) {
    error = actionError(e).message;
  }
  revalidatePath("/admin/reviews");
  redirect(error ? `/admin/reviews?error=${encodeURIComponent(error)}` : "/admin/reviews?deleted=1");
}

// ---------------------------------------------------------------- coupons
export async function saveCoupon(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const payload = readPayload<{ etag: string | null; originalCode?: string; data: unknown }>(formData);
  if (!payload) return invalid;
  const parsed = couponInput.safeParse(payload.data);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };
  try {
    const { data: coupons, etag } = await readDoc("coupons");
    if (etag !== payload.etag) return { ok: false, message: "Coupons were changed by someone else. Reload and try again." };
    const original = payload.originalCode ? coupons.find((c) => c.code === payload.originalCode) : undefined;
    if (coupons.some((c) => c.code === parsed.data.code && c.code !== payload.originalCode)) return { ok: false, errors: { code: "This code already exists." }, message: "Please fix the highlighted fields." };
    const coupon: Coupon = { ...parsed.data, usedCount: original?.usedCount ?? 0, createdAt: original?.createdAt ?? now(), updatedAt: now() };
    const next = original ? coupons.map((c) => (c.code === payload.originalCode ? coupon : c)) : [...coupons, coupon];
    await writeDoc("coupons", next, etag);
  } catch (e) {
    return actionError(e);
  }
  revalidatePath("/admin/coupons");
  redirect(`/admin/coupons?saved=${encodeURIComponent(parsed.data.code)}`);
}

export async function removeCoupon(formData: FormData) {
  await requireAdmin();
  const code = String(formData.get("code") ?? "");
  let error: string | undefined;
  try {
    const { data, etag } = await readDoc("coupons");
    await writeDoc("coupons", data.filter((c) => c.code !== code), etag);
  } catch (e) {
    error = actionError(e).message;
  }
  revalidatePath("/admin/coupons");
  redirect(error ? `/admin/coupons?error=${encodeURIComponent(error)}` : "/admin/coupons?deleted=1");
}
