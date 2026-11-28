"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { startTransition, useActionState, useState } from "react";

import type { HomepageConfig } from "@/lib/admin/schemas";

import { FormMessage, initialActionState, inputClass, labelClass, SubmitButton, Toggle, type ActionState } from "./forms";
import { ImagePicker, type LibraryImage } from "./ImagePicker";
import { Card, secondaryButton } from "./ui";

type Option = { id: string; name: string };
type Promo = HomepageConfig["promoSections"][number];

const move = <T,>(list: T[], i: number, d: -1 | 1) => {
  const j = i + d;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

export function HomepageForm({
  action,
  initial,
  etag,
  products,
  categories,
  library,
  previews,
}: {
  action: (p: ActionState, fd: FormData) => Promise<ActionState>;
  initial: HomepageConfig;
  etag: string | null;
  products: Option[];
  categories: Option[];
  library: LibraryImage[];
  previews: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const [hero, setHero] = useState(initial.hero);
  const [featured, setFeatured] = useState<string[]>(initial.featuredProductIds);
  const [order, setOrder] = useState<string[]>(() => {
    const known = initial.collectionOrder.filter((id) => categories.some((c) => c.id === id));
    return [...known, ...categories.map((c) => c.id).filter((id) => !known.includes(id))];
  });
  const [promos, setPromos] = useState<Promo[]>(initial.promoSections);
  const name = (list: Option[], id: string) => list.find((o) => o.id === id)?.name ?? id;
  const setPromo = (i: number, patch: Partial<Promo>) => setPromos((ps) => ps.map((p, j) => (j === i ? { ...p, ...patch } : p)));

  return (
    <form
      noValidate
      aria-busy={pending || undefined}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.set("payload", JSON.stringify({ etag, data: { hero, featuredProductIds: featured, collectionOrder: order, promoSections: promos.map((p, i) => ({ ...p, order: i })) } }));
        startTransition(() => formAction(fd));
      }}
      className="max-w-5xl space-y-5"
    >
      <FormMessage state={state} />
      <Card>
        <h2 className="mb-4 font-display text-[1.3rem] font-bold text-burgundy">Hero banner</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["eyebrow", "Eyebrow"],
              ["heading", "Heading *"],
              ["ctaLabel", "Button label"],
              ["ctaHref", "Button link (site path)"],
            ] as const
          ).map(([k, l]) => (
            <div key={k}>
              <label htmlFor={`hero-${k}`} className={labelClass}>{l}</label>
              <input id={`hero-${k}`} value={hero[k]} onChange={(e) => setHero((h) => ({ ...h, [k]: e.target.value }))} className={inputClass} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label htmlFor="hero-sub" className={labelClass}>Subheading</label>
            <textarea id="hero-sub" rows={2} value={hero.subheading} onChange={(e) => setHero((h) => ({ ...h, subheading: e.target.value }))} className={`${inputClass} h-auto py-2`} />
          </div>
          <div className="sm:col-span-2">
            <ImagePicker label="Hero image" folder="homepage" value={hero.imageKey ? [hero.imageKey] : []} onChange={(k) => setHero((h) => ({ ...h, imageKey: k[0] }))} previews={previews} library={library} max={1} />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-1 font-display text-[1.3rem] font-bold text-burgundy">Featured products</h2>
        <p className="mb-3 font-sans text-xs text-umber">Shown in the featured / best-seller area, in the order selected.</p>
        {products.length === 0 ? (
          <p className="font-sans text-sm text-umber">No products yet.</p>
        ) : (
          <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Toggle key={p.id} label={p.name} checked={featured.includes(p.id)} onChange={(v) => setFeatured((f) => (v ? [...f, p.id] : f.filter((x) => x !== p.id)))} />
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="mb-3 font-display text-[1.3rem] font-bold text-burgundy">Collection order</h2>
        {order.length === 0 ? (
          <p className="font-sans text-sm text-umber">No categories yet.</p>
        ) : (
          <ol className="space-y-1.5">
            {order.map((id, i) => (
              <li key={id} className="flex items-center gap-2 rounded-xl border border-gold/25 px-3 py-1.5 font-sans text-sm">
                <span className="w-6 text-umber">{i + 1}.</span>
                <span className="flex-1">{name(categories, id)}</span>
                <button type="button" onClick={() => setOrder((o) => move(o, i, -1))} disabled={i === 0} aria-label={`Move ${name(categories, id)} up`} className="grid size-9 place-items-center rounded-lg hover:bg-gold-pale disabled:opacity-30"><ArrowUp aria-hidden="true" className="size-4" /></button>
                <button type="button" onClick={() => setOrder((o) => move(o, i, 1))} disabled={i === order.length - 1} aria-label={`Move ${name(categories, id)} down`} className="grid size-9 place-items-center rounded-lg hover:bg-gold-pale disabled:opacity-30"><ArrowDown aria-hidden="true" className="size-4" /></button>
              </li>
            ))}
          </ol>
        )}
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-[1.3rem] font-bold text-burgundy">Promotional sections</h2>
          <button type="button" onClick={() => setPromos((ps) => [...ps, { id: `promo-${Date.now().toString(36)}`, title: "", text: "", visible: false, order: ps.length }])} disabled={promos.length >= 12} className={secondaryButton}><Plus aria-hidden="true" className="size-4" />Add section</button>
        </div>
        {promos.length === 0 && <p className="font-sans text-sm text-umber">No promotional sections.</p>}
        <ol className="space-y-4">
          {promos.map((p, i) => (
            <li key={p.id} className="rounded-xl border border-gold/30 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={`p${i}-title`} className={labelClass}>Title *</label>
                  <input id={`p${i}-title`} value={p.title} onChange={(e) => setPromo(i, { title: e.target.value })} className={inputClass} />
                </div>
                <div className="flex items-end justify-between gap-2">
                  <Toggle label="Visible" checked={p.visible} onChange={(v) => setPromo(i, { visible: v })} />
                  <div className="flex">
                    <button type="button" onClick={() => setPromos((ps) => move(ps, i, -1))} disabled={i === 0} aria-label="Move section up" className="grid size-10 place-items-center rounded-lg hover:bg-gold-pale disabled:opacity-30"><ArrowUp aria-hidden="true" className="size-4" /></button>
                    <button type="button" onClick={() => setPromos((ps) => move(ps, i, 1))} disabled={i === promos.length - 1} aria-label="Move section down" className="grid size-10 place-items-center rounded-lg hover:bg-gold-pale disabled:opacity-30"><ArrowDown aria-hidden="true" className="size-4" /></button>
                    <button type="button" onClick={() => setPromos((ps) => ps.filter((_, j) => j !== i))} aria-label="Remove section" className="grid size-10 place-items-center rounded-lg text-burgundy hover:bg-[#fde8e6]"><Trash2 aria-hidden="true" className="size-4" /></button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`p${i}-text`} className={labelClass}>Text</label>
                  <textarea id={`p${i}-text`} rows={2} value={p.text} onChange={(e) => setPromo(i, { text: e.target.value })} className={`${inputClass} h-auto py-2`} />
                </div>
                <div>
                  <label htmlFor={`p${i}-cta`} className={labelClass}>Button label</label>
                  <input id={`p${i}-cta`} value={p.ctaLabel ?? ""} onChange={(e) => setPromo(i, { ctaLabel: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label htmlFor={`p${i}-href`} className={labelClass}>Button link (site path)</label>
                  <input id={`p${i}-href`} value={p.ctaHref ?? ""} placeholder="/shop" onChange={(e) => setPromo(i, { ctaHref: e.target.value })} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <ImagePicker label="Section image" folder="homepage" value={p.imageKey ? [p.imageKey] : []} onChange={(k) => setPromo(i, { imageKey: k[0] })} previews={previews} library={library} max={1} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      {state.errors && Object.keys(state.errors).length > 0 && (
        <ul role="alert" className="list-disc rounded-xl bg-[#fde8e6] py-3 pl-8 pr-4 font-sans text-sm text-burgundy">
          {Object.entries(state.errors).map(([k, m]) => <li key={k}>{k}: {m}</li>)}
        </ul>
      )}
      <SubmitButton pending={pending}>Save homepage</SubmitButton>
    </form>
  );
}
