"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ActionState } from "@/components/admin/forms";
import { fieldErrors, productInput } from "@/lib/admin/schemas";
import { readPayload } from "@/lib/server/admin-data";
import { requireAdmin } from "@/lib/server/auth";
import { actionError } from "@/lib/server/load";
import { createProduct, deleteProduct, getCategory, updateProduct } from "@/lib/server/repo/catalog";

type Payload = { productId?: string; version?: number; data: unknown };

export async function saveProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const payload = readPayload<Payload>(formData);
  if (!payload) return { ok: false, message: "Invalid form submission." };

  const parsed = productInput.safeParse(payload.data);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };
  const ids = parsed.data.variants.map((v) => v.id);
  if (new Set(ids).size !== ids.length) return { ok: false, errors: { variants: "Each size needs a unique ID." }, message: "Please fix the highlighted fields." };

  let productId = payload.productId;
  try {
    if (!(await getCategory(parsed.data.categoryId))) return { ok: false, errors: { categoryId: "Choose an existing category." }, message: "Please fix the highlighted fields." };
    if (productId) await updateProduct(productId, parsed.data, Number(payload.version));
    else productId = await createProduct(parsed.data);
  } catch (e) {
    return actionError(e);
  }
  revalidatePath("/admin/products");
  redirect(`/admin/products?saved=${encodeURIComponent(parsed.data.name)}`);
}

export async function removeProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const version = Number(formData.get("version"));
  let error: string | undefined;
  try {
    if (!/^prd_[a-z0-9]+$/.test(id)) throw new Error("Invalid product");
    await deleteProduct(id, version);
  } catch (e) {
    error = actionError(e).message;
  }
  revalidatePath("/admin/products");
  redirect(error ? `/admin/products?error=${encodeURIComponent(error)}` : "/admin/products?deleted=1");
}
