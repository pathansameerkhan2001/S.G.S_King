"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ActionState } from "@/components/admin/forms";
import { categoryInput, fieldErrors } from "@/lib/admin/schemas";
import { readPayload } from "@/lib/server/admin-data";
import { requireAdmin } from "@/lib/server/auth";
import { actionError } from "@/lib/server/load";
import { categories as storefrontCategories } from "@/content/categories";
import { categoryDetails } from "@/content/categoryDetails";
import { createCategory, deleteCategory, listCategories, updateCategory } from "@/lib/server/repo/catalog";

type Payload = { isNew: boolean; version?: number; data: unknown };

export async function saveCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const payload = readPayload<Payload>(formData);
  if (!payload) return { ok: false, message: "Invalid form submission." };
  const parsed = categoryInput.safeParse(payload.data);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };
  try {
    if (payload.isNew) await createCategory(parsed.data);
    else await updateCategory(parsed.data, Number(payload.version));
  } catch (e) {
    return actionError(e);
  }
  revalidatePath("/admin/categories");
  redirect(`/admin/categories?saved=${encodeURIComponent(parsed.data.name)}`);
}

export async function removeCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  let error: string | undefined;
  try {
    if (!/^[a-z0-9-]{2,80}$/.test(id)) throw new Error("Invalid category");
    await deleteCategory(id, Number(formData.get("version")));
  } catch (e) {
    error = actionError(e).message;
  }
  revalidatePath("/admin/categories");
  redirect(error ? `/admin/categories?error=${encodeURIComponent(error)}` : "/admin/categories?deleted=1");
}

/**
 * One-click import of the 7 real storefront categories (names, slugs,
 * descriptions). Admin-initiated and idempotent: only missing ones are created.
 * Images are not copied (storefront illustrations are placeholders).
 */
export async function importStorefrontCategories() {
  await requireAdmin();
  let created = 0;
  let error: string | undefined;
  try {
    const existing = new Set((await listCategories()).map((c) => c.categoryId));
    for (const [i, c] of storefrontCategories.entries()) {
      if (existing.has(c.slug)) continue;
      await createCategory(categoryInput.parse({ categoryId: c.slug, name: c.name, description: categoryDetails[c.slug].description, displayOrder: (i + 1) * 10, visible: true }));
      created++;
    }
  } catch (e) {
    error = actionError(e).message;
  }
  revalidatePath("/admin/categories");
  redirect(error ? `/admin/categories?error=${encodeURIComponent(error)}` : `/admin/categories?saved=${encodeURIComponent(`${created} storefront categor${created === 1 ? "y" : "ies"}`)}`);
}
