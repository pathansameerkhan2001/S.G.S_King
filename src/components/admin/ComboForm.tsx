"use client";

import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useMemo, useState } from "react";

import type { Combo } from "@/lib/admin/schemas";

import { FieldError, FormMessage, initialActionState, inputClass, labelClass, SubmitButton, Toggle, type ActionState } from "./forms";
import { ImagePicker, type LibraryImage } from "./ImagePicker";
import { Card, formatInr, secondaryButton } from "./ui";

export type ProductOption = { productId: string; name: string; price: number };

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

export function ComboForm({
  action,
  combo,
  products,
  library,
  previews,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  combo?: Combo;
  products: ProductOption[];
  library: LibraryImage[];
  previews: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const [name, setName] = useState(combo?.name ?? "");
  const [slug, setSlug] = useState(combo?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!combo);
  const [items, setItems] = useState(combo?.items.map((i) => ({ productId: i.productId, quantity: String(i.quantity) })) ?? [{ productId: "", quantity: "1" }]);
  const [images, setImages] = useState<string[]>(combo?.images ?? []);
  const [price, setPrice] = useState(combo?.price?.toString() ?? "");
  const [flags, setFlags] = useState({ visible: combo?.visible ?? true, isFeatured: combo?.isFeatured ?? false });

  const byId = useMemo(() => new Map(products.map((p) => [p.productId, p])), [products]);
  const individualTotal = items.reduce((n, i) => n + (byId.get(i.productId)?.price ?? 0) * (Number(i.quantity) || 0), 0);

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
            comboId: combo?.comboId,
            version: combo?.version,
            data: {
              name,
              slug,
              description: String(f.get("description") ?? ""),
              items: items.filter((i) => i.productId).map((i) => ({ productId: i.productId, quantity: i.quantity })),
              price,
              mrp: String(f.get("mrp") ?? ""),
              packSize: String(f.get("packSize") ?? ""),
              badge: String(f.get("badge") ?? ""),
              images,
              availability: String(f.get("availability") ?? "in_stock"),
              displayOrder: Number(f.get("displayOrder") ?? 100),
              ...flags,
            },
          }),
        );
        startTransition(() => formAction(fd));
      }}
      className="space-y-5"
    >
      <FormMessage state={state} />
      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className={labelClass}>Combo name *</label>
                <input id="name" value={name} onChange={(e) => { setName(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }} aria-invalid={!!state.errors?.name || undefined} className={inputClass} />
                <FieldError state={state} name="name" />
              </div>
              <div>
                <label htmlFor="slug" className={labelClass}>URL slug *</label>
                <input id="slug" value={slug} onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }} aria-invalid={!!state.errors?.slug || undefined} className={inputClass} />
                <p className="mt-1 font-sans text-xs text-umber">/combos/{slug || "…"}</p>
                <FieldError state={state} name="slug" />
              </div>
              <div>
                <label htmlFor="packSize" className={labelClass}>Pack size</label>
                <input id="packSize" name="packSize" defaultValue={combo?.packSize} placeholder="e.g. 1.25 kg" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="description" className={labelClass}>Description</label>
                <textarea id="description" name="description" defaultValue={combo?.description} rows={3} className={`${inputClass} h-auto py-2`} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-[1.3rem] font-bold text-burgundy">Products in this combo</h2>
              <button type="button" onClick={() => setItems((xs) => [...xs, { productId: "", quantity: "1" }])} className={secondaryButton}>
                <Plus aria-hidden="true" className="size-4" />Add product
              </button>
            </div>
            <FieldError state={state} name="items" />
            {products.length === 0 && <p className="font-sans text-sm text-burgundy">Create products first.</p>}
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="grid grid-cols-[1fr_90px_auto] items-end gap-2">
                  <div>
                    <label htmlFor={`item-${i}`} className={labelClass}>Product</label>
                    <select id={`item-${i}`} value={item.productId} onChange={(e) => setItems((xs) => xs.map((x, j) => (j === i ? { ...x, productId: e.target.value } : x)))} className={inputClass}>
                      <option value="">Select…</option>
                      {products.map((p) => (
                        <option key={p.productId} value={p.productId}>{p.name} ({formatInr(p.price)})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`qty-${i}`} className={labelClass}>Qty</label>
                    <input id={`qty-${i}`} type="number" min={1} max={50} value={item.quantity} onChange={(e) => setItems((xs) => xs.map((x, j) => (j === i ? { ...x, quantity: e.target.value } : x)))} className={inputClass} />
                  </div>
                  <button type="button" onClick={() => setItems((xs) => xs.filter((_, j) => j !== i))} disabled={items.length === 1} aria-label={`Remove product row ${i + 1}`} className="grid size-11 place-items-center rounded-xl text-burgundy hover:bg-[#fde8e6] disabled:opacity-30">
                    <Trash2 aria-hidden="true" className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-sans text-sm text-umber">
              Bought individually (first size): <strong className="text-ink">{formatInr(individualTotal)}</strong>
              {Number(price) > 0 && individualTotal > Number(price) && <> · customer saves <strong className="text-[#2f7a3d]">{formatInr(individualTotal - Number(price))}</strong></>}
            </p>
          </Card>

          <Card>
            <ImagePicker label="Combo images" folder="combos" value={images} onChange={setImages} previews={previews} library={library} max={8} />
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <h2 className="mb-3 font-display text-[1.3rem] font-bold text-burgundy">Pricing</h2>
            <label htmlFor="price" className={labelClass}>Combo price ₹ *</label>
            <input id="price" inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value)} aria-invalid={!!state.errors?.price || undefined} className={inputClass} />
            <FieldError state={state} name="price" />
            <label htmlFor="mrp" className={`${labelClass} mt-3`}>Original price ₹</label>
            <input id="mrp" name="mrp" inputMode="numeric" defaultValue={combo?.mrp} className={inputClass} />
            <FieldError state={state} name="mrp" />
          </Card>
          <Card>
            <label htmlFor="availability" className={labelClass}>Availability</label>
            <select id="availability" name="availability" defaultValue={combo?.availability ?? "in_stock"} className={inputClass}>
              <option value="in_stock">In stock</option>
              <option value="low_stock">Low stock</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
            <div className="mt-2">
              <Toggle label="Visible on storefront" checked={flags.visible} onChange={(v) => setFlags((f) => ({ ...f, visible: v }))} />
              <Toggle label="Featured" checked={flags.isFeatured} onChange={(v) => setFlags((f) => ({ ...f, isFeatured: v }))} />
            </div>
            <label htmlFor="badge" className={`${labelClass} mt-2`}>Badge</label>
            <input id="badge" name="badge" defaultValue={combo?.badge} placeholder="e.g. Family Pack" className={inputClass} />
            <label htmlFor="displayOrder" className={`${labelClass} mt-3`}>Display order</label>
            <input id="displayOrder" name="displayOrder" type="number" min={0} defaultValue={combo?.displayOrder ?? 100} className={inputClass} />
          </Card>
          <div className="flex gap-2">
            <SubmitButton pending={pending}>{combo ? "Save changes" : "Create combo"}</SubmitButton>
            <Link href="/admin/combos" className={secondaryButton}>Cancel</Link>
          </div>
        </div>
      </div>
    </form>
  );
}
