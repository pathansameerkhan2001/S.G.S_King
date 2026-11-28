"use client";

import { useActionState } from "react";

import { orderStatuses, paymentStatuses, type Order } from "@/lib/admin/schemas";

import { FormMessage, initialActionState, inputClass, labelClass, SubmitButton, type ActionState } from "./forms";

const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function OrderStatusForm({ order, action }: { order: Order; action: (prev: ActionState, fd: FormData) => Promise<ActionState> }) {
  const [state, formAction] = useActionState(action, initialActionState);
  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="orderId" value={order.orderId} />
      <input type="hidden" name="version" value={order.version} />
      <FormMessage state={state} />
      <div>
        <label htmlFor="status" className={labelClass}>Order status</label>
        <select id="status" name="status" defaultValue={order.status} className={inputClass}>
          {orderStatuses.map((s) => (
            <option key={s} value={s}>{label(s)}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="paymentStatus" className={labelClass}>Payment status ({order.payment.method === "cod" ? "Cash on Delivery" : "Online"})</label>
        <select id="paymentStatus" name="paymentStatus" defaultValue={order.payment.status} className={inputClass}>
          {paymentStatuses.map((s) => (
            <option key={s} value={s}>{label(s)}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="paymentReference" className={labelClass}>Payment reference</label>
        <input id="paymentReference" name="paymentReference" defaultValue={order.payment.reference} placeholder="UPI / transaction ID" className={inputClass} />
      </div>
      <div>
        <label htmlFor="note" className={labelClass}>Timeline note</label>
        <textarea id="note" name="note" rows={2} placeholder="e.g. Shipped via courier, tracking #…" className={`${inputClass} h-auto py-2`} />
      </div>
      <SubmitButton>Update order</SubmitButton>
    </form>
  );
}
