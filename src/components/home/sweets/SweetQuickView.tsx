"use client";

import { ArrowRight, Candy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductPrice } from "@/components/product/ProductPrice";
import { ShareProductButton } from "@/components/product/ShareProductButton";
import { productHref } from "@/content/products";
import type { SweetProduct } from "@/content/sweets";

export const SWEET_QUICK_VIEW_TITLE_ID = "sweet-quick-view-title";

/** Body of the sweets quick view (rendered inside QuickViewDialog). */
export function SweetQuickView({ product }: { product: SweetProduct }) {
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const href = productHref(product.slug);

  return (
    <div className="grid sm:grid-cols-[1fr_1.1fr]">
      <div className="relative aspect-[4/3] bg-gradient-to-b from-gold-pale/60 to-cream sm:aspect-auto sm:min-h-[420px]">
        {product.image ? (
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            unoptimized={product.image.src.endsWith(".svg")}
            sizes="(min-width: 640px) 400px, 92vw"
            className={product.image.fit === "contain" ? "object-contain p-6" : "object-cover"}
          />
        ) : (
          <span className="flex size-full items-center justify-center text-gold-deep/60">
            <Candy className="size-12" strokeWidth={1.2} />
          </span>
        )}
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-burgundy px-2.5 py-1 font-sans text-[0.62rem] font-bold uppercase tracking-[0.12em] text-ivory">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3.5 p-5 pt-6 sm:p-7">
        <h2
          id={SWEET_QUICK_VIEW_TITLE_ID}
          className="pr-10 font-display text-[1.6rem] font-bold leading-tight text-burgundy sm:text-[1.9rem]"
        >
          {product.name}
        </h2>
        <p className="font-display text-[1.08rem] leading-snug text-ink/85">{product.description}</p>

        {product.ingredients && product.ingredients.length > 0 && (
          <div>
            <h3 className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-umber">Ingredients</h3>
            <p className="mt-1 font-display text-[1rem] text-ink/85">{product.ingredients.join(", ")}</p>
          </div>
        )}

        <fieldset>
          <legend className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-umber">
            {product.variants.length > 1 ? "Choose weight" : "Weight"}
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <label
                key={v.id}
                className="cursor-pointer rounded-full border border-gold/50 px-4 py-1.5 font-sans text-sm font-semibold text-umber transition-colors has-[:checked]:border-burgundy has-[:checked]:bg-burgundy has-[:checked]:text-ivory has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold hover:border-burgundy"
              >
                <input
                  type="radio"
                  name="sweet-variant"
                  value={v.id}
                  checked={v.id === variant.id}
                  onChange={() => setVariantId(v.id)}
                  className="sr-only"
                />
                {v.label}
              </label>
            ))}
          </div>
        </fieldset>

        <ProductPrice product={variant} />

        <div className="mt-auto space-y-3 pt-1">
          {product.availability === "out_of_stock" ? (
            <p className="rounded-xl bg-umber/15 py-3 text-center font-display font-semibold text-umber">Out of Stock</p>
          ) : (
            <div className="grid grid-cols-[1fr_auto] items-center gap-2">
              <AddToCartButton itemKey={`product:${product.slug}`} variantId={variant.id} name={`${product.name} (${variant.label})`} />
              <ShareProductButton productName={product.name} path={href} onStatus={setShareStatus} />
            </div>
          )}
          <p role="status" aria-live="polite" className="min-h-5 font-sans text-xs font-medium text-burgundy">
            {shareStatus}
          </p>
          <Link
            href={href}
            className="group inline-flex items-center gap-1.5 font-display text-[1.05rem] font-semibold text-burgundy underline decoration-gold/60 underline-offset-4 hover:decoration-burgundy"
          >
            View full details
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
