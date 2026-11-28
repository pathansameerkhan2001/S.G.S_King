"use server";

import { revalidatePath } from "next/cache";

import type { ActionState } from "@/components/admin/forms";
import { fieldErrors, orderUpdateInput } from "@/lib/admin/schemas";
import { requireAdmin } from "@/lib/server/auth";
import { actionError } from "@/lib/server/load";
import { updateOrder } from "@/lib/server/repo/catalog";

export async function saveOrderStatus(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const orderId = String(formData.get("orderId") ?? "");
  if (!/^[A-Za-z0-9_-]{4,60}$/.test(orderId)) return { ok: false, message: "Invalid order." };
  const parsed = orderUpdateInput.safeParse({
    status: formData.get("status"),
    paymentStatus: formData.get("paymentStatus"),
    paymentReference: formData.get("paymentReference") ?? "",
    note: formData.get("note") ?? "",
  });
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };
  try {
    await updateOrder(orderId, parsed.data, Number(formData.get("version")), session.email ?? session.sub);
  } catch (e) {
    return actionError(e);
  }
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { ok: true, message: "Order updated." };
}
