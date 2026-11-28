"use client";

import { Plus, Trash2 } from "lucide-react";
import { startTransition, useActionState, useState } from "react";

import type { StoreSettings } from "@/lib/admin/schemas";

import { FieldError, FormMessage, initialActionState, inputClass, labelClass, SubmitButton, Toggle, type ActionState } from "./forms";
import { Card, secondaryButton } from "./ui";

type ListEditorProps = { label: string; values: string[]; onChange: (v: string[]) => void; max: number; placeholder?: string; inputMode?: "numeric" };

function ListEditor({ label, values, onChange, max, placeholder, inputMode }: ListEditorProps) {
  return (
    <fieldset>
      <legend className={labelClass}>{label}</legend>
      <ul className="space-y-2">
        {values.map((v, i) => (
          <li key={i} className="flex gap-2">
            <input aria-label={`${label} ${i + 1}`} value={v} inputMode={inputMode} placeholder={placeholder} onChange={(e) => onChange(values.map((x, j) => (j === i ? e.target.value : x)))} className={inputClass} />
            <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} aria-label={`Remove ${label} ${i + 1}`} className="grid size-11 shrink-0 place-items-center rounded-xl text-burgundy hover:bg-[#fde8e6]">
              <Trash2 aria-hidden="true" className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      {values.length < max && (
        <button type="button" onClick={() => onChange([...values, ""])} className={`${secondaryButton} mt-2`}>
          <Plus aria-hidden="true" className="size-4" />Add
        </button>
      )}
    </fieldset>
  );
}

export function SettingsForm({ action, initial, etag }: { action: (p: ActionState, fd: FormData) => Promise<ActionState>; initial: StoreSettings; etag: string | null }) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const [s, setS] = useState({
    ...initial,
    deliveryFee: initial.deliveryFee?.toString() ?? "",
    freeDeliveryAbove: initial.freeDeliveryAbove?.toString() ?? "",
  });
  const set = <K extends keyof typeof s>(k: K, v: (typeof s)[K]) => setS((x) => ({ ...x, [k]: v }));

  return (
    <form
      noValidate
      aria-busy={pending || undefined}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.set("payload", JSON.stringify({ etag, data: { ...s, phones: s.phones.filter(Boolean), addressLines: s.addressLines.filter(Boolean), announcement: s.announcement.filter(Boolean) } }));
        startTransition(() => formAction(fd));
      }}
      className="max-w-4xl space-y-5"
    >
      <FormMessage state={state} />
      <Card>
        <h2 className="mb-4 font-display text-[1.3rem] font-bold text-burgundy">Store &amp; contact</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="storeName" className={labelClass}>Store name *</label>
            <input id="storeName" value={s.storeName} onChange={(e) => set("storeName", e.target.value)} className={inputClass} />
            <FieldError state={state} name="storeName" />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email *</label>
            <input id="email" type="email" value={s.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
            <FieldError state={state} name="email" />
          </div>
          <div>
            <ListEditor label="Phone numbers" values={s.phones} onChange={(v) => set("phones", v)} max={4} inputMode="numeric" placeholder="10-digit mobile" />
            <FieldError state={state} name="phones" />
            {Object.keys(state.errors ?? {}).some((k) => k.startsWith("phones.")) && <p className="mt-1 font-sans text-xs font-semibold text-burgundy">Each phone must be a 10-digit Indian mobile number.</p>}
          </div>
          <div>
            <ListEditor label="Address lines" values={s.addressLines} onChange={(v) => set("addressLines", v)} max={5} />
            <FieldError state={state} name="addressLines" />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-display text-[1.3rem] font-bold text-burgundy">WhatsApp</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="whatsapp" className={labelClass}>WhatsApp number *</label>
            <input id="whatsapp" inputMode="numeric" value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={inputClass} />
            <FieldError state={state} name="whatsapp" />
          </div>
          <div>
            <label htmlFor="whatsappGreeting" className={labelClass}>Pre-filled greeting</label>
            <input id="whatsappGreeting" value={s.whatsappGreeting} onChange={(e) => set("whatsappGreeting", e.target.value)} className={inputClass} />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-1 font-display text-[1.3rem] font-bold text-burgundy">Delivery &amp; payment</h2>
        <p className="mb-4 font-sans text-xs text-umber">Leave the fee empty if not yet decided: the storefront shows “to be confirmed”.</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="deliveryFee" className={labelClass}>Delivery fee ₹</label>
            <input id="deliveryFee" inputMode="numeric" value={s.deliveryFee} onChange={(e) => set("deliveryFee", e.target.value)} className={inputClass} />
            <FieldError state={state} name="deliveryFee" />
          </div>
          <div>
            <label htmlFor="freeDeliveryAbove" className={labelClass}>Free delivery above ₹</label>
            <input id="freeDeliveryAbove" inputMode="numeric" value={s.freeDeliveryAbove} onChange={(e) => set("freeDeliveryAbove", e.target.value)} className={inputClass} />
            <FieldError state={state} name="freeDeliveryAbove" />
          </div>
          <div className="flex items-end">
            <Toggle label="Cash on Delivery offered" checked={s.codEnabled} onChange={(v) => set("codEnabled", v)} />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-display text-[1.3rem] font-bold text-burgundy">Business hours</h2>
        <ul className="space-y-2">
          {s.businessHours.map((h, i) => (
            <li key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input aria-label={`Days ${i + 1}`} placeholder="Monday – Saturday" value={h.days} onChange={(e) => set("businessHours", s.businessHours.map((x, j) => (j === i ? { ...x, days: e.target.value } : x)))} className={inputClass} />
              <input aria-label={`Hours ${i + 1}`} placeholder="9:00 AM – 7:00 PM" value={h.hours} onChange={(e) => set("businessHours", s.businessHours.map((x, j) => (j === i ? { ...x, hours: e.target.value } : x)))} className={inputClass} />
              <button type="button" onClick={() => set("businessHours", s.businessHours.filter((_, j) => j !== i))} aria-label={`Remove hours row ${i + 1}`} className="grid size-11 place-items-center rounded-xl text-burgundy hover:bg-[#fde8e6]"><Trash2 aria-hidden="true" className="size-4" /></button>
            </li>
          ))}
        </ul>
        {s.businessHours.length < 7 && (
          <button type="button" onClick={() => set("businessHours", [...s.businessHours, { days: "", hours: "" }])} className={`${secondaryButton} mt-2`}><Plus aria-hidden="true" className="size-4" />Add hours</button>
        )}
      </Card>

      <Card>
        <h2 className="mb-4 font-display text-[1.3rem] font-bold text-burgundy">Storefront content</h2>
        <ListEditor label="Announcement bar messages" values={s.announcement} onChange={(v) => set("announcement", v)} max={6} />
      </Card>

      <SubmitButton pending={pending}>Save settings</SubmitButton>
    </form>
  );
}
