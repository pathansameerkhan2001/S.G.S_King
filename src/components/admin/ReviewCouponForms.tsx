"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";

import type { Coupon, Review } from "@/lib/admin/schemas";

import { FieldError, FormMessage, initialActionState, inputClass, labelClass, SubmitButton, Toggle, type ActionState } from "./forms";
import { ImagePicker, type LibraryImage } from "./ImagePicker";
import { Card, secondaryButton } from "./ui";

type Action = (p: ActionState, fd: FormData) => Promise<ActionState>;

export function ReviewForm({ action, review, etag, library, previews }: { action: Action; review?: Review; etag: string | null; library: LibraryImage[]; previews: Record<string, string> }) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const [image, setImage] = useState<string[]>(review?.imageKey ? [review.imageKey] : []);
  const [flags, setFlags] = useState({ approved: review?.approved ?? false, visible: review?.visible ?? false });
  return (
    <form
      noValidate
      aria-busy={pending || undefined}
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const fd = new FormData();
        fd.set(
          "payload",
          JSON.stringify({
            etag,
            data: {
              id: review?.id ?? "",
              customerName: f.get("customerName"),
              location: f.get("location"),
              text: f.get("text"),
              rating: f.get("rating"),
              orderId: f.get("orderId"),
              imageKey: image[0],
              displayOrder: f.get("displayOrder"),
              ...flags,
            },
          }),
        );
        startTransition(() => formAction(fd));
      }}
      className="space-y-4"
    >
      <FormMessage state={state} />
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="customerName" className={labelClass}>Customer name *</label>
            <input id="customerName" name="customerName" defaultValue={review?.customerName} className={inputClass} />
            <FieldError state={state} name="customerName" />
          </div>
          <div>
            <label htmlFor="location" className={labelClass}>Location</label>
            <input id="location" name="location" defaultValue={review?.location} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="text" className={labelClass}>Review text * (exactly as the customer wrote it)</label>
            <textarea id="text" name="text" rows={3} defaultValue={review?.text} className={`${inputClass} h-auto py-2`} />
            <FieldError state={state} name="text" />
          </div>
          <div>
            <label htmlFor="rating" className={labelClass}>Rating (1–5) *</label>
            <select id="rating" name="rating" defaultValue={review?.rating ?? 5} className={inputClass}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="orderId" className={labelClass}>Linked order ID</label>
            <input id="orderId" name="orderId" defaultValue={review?.orderId} aria-describedby="orderId-hint" className={inputClass} />
            <p id="orderId-hint" className="mt-1 font-sans text-xs text-umber">“Verified purchase” is set automatically only when this matches a real order.</p>
            <FieldError state={state} name="orderId" />
          </div>
          <div>
            <label htmlFor="displayOrder" className={labelClass}>Display order</label>
            <input id="displayOrder" name="displayOrder" type="number" min={0} defaultValue={review?.displayOrder ?? 100} className={inputClass} />
          </div>
          <div className="flex items-end gap-4">
            <Toggle label="Approved" checked={flags.approved} onChange={(v) => setFlags((f) => ({ ...f, approved: v }))} />
            <Toggle label="Visible on site" checked={flags.visible} onChange={(v) => setFlags((f) => ({ ...f, visible: v }))} />
          </div>
          <div className="sm:col-span-2">
            <ImagePicker label="Review screenshot" folder="reviews" value={image} onChange={setImage} previews={previews} library={library} max={1} />
          </div>
        </div>
      </Card>
      <div className="flex gap-2">
        <SubmitButton pending={pending}>{review ? "Save review" : "Add review"}</SubmitButton>
        {review && <Link href="/admin/reviews" className={secondaryButton}>Cancel</Link>}
      </div>
    </form>
  );
}

export function CouponForm({ action, coupon, etag }: { action: Action; coupon?: Coupon; etag: string | null }) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const [active, setActive] = useState(coupon?.active ?? true);
  return (
    <form
      noValidate
      aria-busy={pending || undefined}
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const data = Object.fromEntries(["code", "type", "value", "minOrder", "maxUses", "perCustomerLimit", "startsAt", "endsAt"].map((k) => [k, f.get(k) ?? ""]));
        const fd = new FormData();
        fd.set("payload", JSON.stringify({ etag, originalCode: coupon?.code, data: { ...data, active } }));
        startTransition(() => formAction(fd));
      }}
      className="space-y-4"
    >
      <FormMessage state={state} />
      <Card>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="code" className={labelClass}>Code *</label>
            <input id="code" name="code" defaultValue={coupon?.code} className={`${inputClass} uppercase`} />
            <FieldError state={state} name="code" />
          </div>
          <div>
            <label htmlFor="type" className={labelClass}>Discount type</label>
            <select id="type" name="type" defaultValue={coupon?.type ?? "percent"} className={inputClass}>
              <option value="percent">Percentage (%)</option>
              <option value="fixed">Fixed amount (₹)</option>
            </select>
          </div>
          <div>
            <label htmlFor="value" className={labelClass}>Value *</label>
            <input id="value" name="value" inputMode="numeric" defaultValue={coupon?.value} className={inputClass} />
            <FieldError state={state} name="value" />
          </div>
          <div>
            <label htmlFor="minOrder" className={labelClass}>Minimum order ₹</label>
            <input id="minOrder" name="minOrder" inputMode="numeric" defaultValue={coupon?.minOrder} className={inputClass} />
          </div>
          <div>
            <label htmlFor="maxUses" className={labelClass}>Total uses limit</label>
            <input id="maxUses" name="maxUses" inputMode="numeric" defaultValue={coupon?.maxUses} className={inputClass} />
          </div>
          <div>
            <label htmlFor="perCustomerLimit" className={labelClass}>Uses per customer</label>
            <input id="perCustomerLimit" name="perCustomerLimit" inputMode="numeric" defaultValue={coupon?.perCustomerLimit} className={inputClass} />
          </div>
          <div>
            <label htmlFor="startsAt" className={labelClass}>Valid from</label>
            <input id="startsAt" name="startsAt" type="date" defaultValue={coupon?.startsAt} className={inputClass} />
          </div>
          <div>
            <label htmlFor="endsAt" className={labelClass}>Valid until</label>
            <input id="endsAt" name="endsAt" type="date" defaultValue={coupon?.endsAt} className={inputClass} />
            <FieldError state={state} name="endsAt" />
          </div>
          <div className="flex items-end">
            <Toggle label="Enabled" checked={active} onChange={setActive} />
          </div>
        </div>
      </Card>
      <div className="flex gap-2">
        <SubmitButton pending={pending}>{coupon ? "Save coupon" : "Create coupon"}</SubmitButton>
        {coupon && <Link href="/admin/coupons" className={secondaryButton}>Cancel</Link>}
      </div>
    </form>
  );
}
