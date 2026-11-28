"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { mediaKey } from "@/lib/admin/schemas";
import { requireAdmin } from "@/lib/server/auth";
import { actionError } from "@/lib/server/load";
import { deleteMedia } from "@/lib/server/repo/media";

/** Deletes an image only if nothing references it (checked server-side). */
export async function removeMedia(formData: FormData) {
  await requireAdmin();
  const key = String(formData.get("key") ?? "");
  let error: string | undefined;
  try {
    if (!mediaKey.safeParse(key).success) throw new Error("Invalid media key");
    await deleteMedia(key);
  } catch (e) {
    error = actionError(e).message;
  }
  revalidatePath("/admin/media");
  redirect(error ? `/admin/media?error=${encodeURIComponent(error)}` : "/admin/media?deleted=1");
}
