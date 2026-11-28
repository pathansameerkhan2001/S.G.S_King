"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ActionState } from "@/components/admin/forms";
import { comboInput, fieldErrors } from "@/lib/admin/schemas";
import { readPayload } from "@/lib/server/admin-data";
import { requireAdmin } from "@/lib/server/auth";
import { actionError } from "@/lib/server/load";
import { createCombo, deleteCombo, updateCombo } from "@/lib/server/repo/catalog";

type Payload = { comboId?: string; version?: number; data: unknown };

export async function saveCombo(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const payload = readPayload<Payload>(formData);
  if (!payload) return { ok: false, message: "Invalid form submission." };
  const parsed = comboInput.safeParse(payload.data);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };
  const ids = parsed.data.items.map((i) => i.productId);
  if (new Set(ids).size !== ids.length) return { ok: false, errors: { items: "Each product can only be added once (adjust the quantity instead)." } };
  try {
    if (payload.comboId) await updateCombo(payload.comboId, parsed.data, Number(payload.version));
    else await createCombo(parsed.data);
  } catch (e) {
    return actionError(e);
  }
  revalidatePath("/admin/combos");
  redirect(`/admin/combos?saved=${encodeURIComponent(parsed.data.name)}`);
}

export async function removeCombo(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  let error: string | undefined;
  try {
    if (!/^cmb_[a-z0-9]+$/.test(id)) throw new Error("Invalid combo");
    await deleteCombo(id, Number(formData.get("version")));
  } catch (e) {
    error = actionError(e).message;
  }
  revalidatePath("/admin/combos");
  redirect(error ? `/admin/combos?error=${encodeURIComponent(error)}` : "/admin/combos?deleted=1");
}
