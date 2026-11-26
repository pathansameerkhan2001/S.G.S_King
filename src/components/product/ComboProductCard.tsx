"use client";

import { Eye, Gift, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { comboDiscount, comboHref, type ComboProduct } from "@/content/combos";

import { AddToCartButton } from "./AddToCartButton";
import { ProductPrice } from "./ProductPrice";
import { ShareProductButton } from "./ShareProductButton";

type ComboProductCardProps = {
  combo: ComboProduct;
  /** Opens the quick-view dialog for this combo. */
  onQuickView: (combo: ComboProduct, trigger: HTMLButtonElement) => void;
};

export function ComboProductCard({ combo, onQuickView }: ComboProductCardProps) {
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const href = comboHref(combo.slug);
  const discount = comboDiscount(combo);
  const soldOut = combo.availability === "out_of_stock";

  return (
    <article
      className={[
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gold/30 bg-ivory",
        "shadow-[0_12px_32px_-22px_rgba(53,23,15,0.5)] transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1 hover:border-gold/70 hover:shadow-[0_24px_44px_-24px_rgba(101,10,22,0.45)]",
      ].join(" ")}
    >
      {/* Image: fixed 4:3 ratio for consistent card heights */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-gold-pale/60 to-cream">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0">
          {combo.image ? (
            <Image
              src={combo.image.src}
              alt=""
              fill
              unoptimized={combo.image.src.endsWith(".svg")}
              sizes="(min-width: 1280px) 300px, (min-width: 1024px) 31vw, (min-width: 640px) 44vw, 80vw"
              className={`transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] ${
                combo.image.fit === "contain" ? "object-contain p-4" : "object-cover"
              }`}
            />
          ) : (
            <span className="flex size-full flex-col items-center justify-center gap-2 text-gold-deep/60">
              <Gift className="size-9" strokeWidth={1.2} />
              <span className="font-sans text-[0.65rem] uppercase tracking-[0.2em]">Image coming soon</span>
            </span>
          )}
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {combo.badge && (
            <span className="rounded-full bg-burgundy px-2.5 py-1 font-sans text-[0.62rem] font-bold uppercase tracking-[0.12em] text-ivory shadow-sm">
              {combo.badge}
            </span>
          )}
          {discount !== null && (
            <span className="rounded-full bg-gold px-2.5 py-1 font-sans text-[0.68rem] font-bold text-ink shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3">
          <ShareProductButton productName={combo.name} path={href} onStatus={setShareStatus} />
        </div>

        {combo.availability === "low_stock" && (
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ivory/90 px-2.5 py-1 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-burgundy shadow-sm">
            Few left
          </span>
        )}

        <p
          role="status"
          aria-live="polite"
          className={`pointer-events-none absolute inset-x-3 bottom-3 rounded-full bg-ink/85 px-3 py-1.5 text-center font-sans text-xs font-medium text-ivory transition-all duration-300 ${
            shareStatus ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          {shareStatus}
        </p>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-2 p-4 xl:p-5">
        <h3 className="font-display text-[1.2rem] font-semibold leading-tight text-ink sm:text-[1.28rem]">
          <Link href={href} className="transition-colors hover:text-burgundy">
            {combo.name}
          </Link>
        </h3>

        {/* Two lines reserved so cards stay equal height */}
        <p className="line-clamp-2 min-h-[2.6em] font-sans text-[0.8rem] leading-[1.3] text-umber">
          {combo.description}
        </p>

        <p className="flex flex-wrap items-center gap-1.5">
          {combo.packSize && (
            <span className="rounded-full border border-gold/45 bg-gold-pale/60 px-2.5 py-0.5 font-sans text-[0.7rem] font-semibold text-umber">
              <span className="sr-only">Pack size: </span>
              {combo.packSize}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full border border-gold/45 bg-gold-pale/60 px-2.5 py-0.5 font-sans text-[0.7rem] font-semibold text-umber">
            <Package aria-hidden="true" className="size-3" strokeWidth={2} />
            {combo.includedItems.length} items
          </span>
        </p>

        <ProductPrice product={combo} />

        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-2">
          {soldOut ? (
            <button
              type="button"
              disabled
              className="h-11 rounded-xl bg-umber/25 font-display text-[1rem] font-semibold text-umber sm:h-12"
            >
              Out of Stock
            </button>
          ) : (
            <AddToCartButton itemKey={`combo:${combo.slug}`} name={combo.name} />
          )}
          <button
            type="button"
            onClick={(e) => onQuickView(combo, e.currentTarget)}
            aria-label={`Quick view: ${combo.name}`}
            title="Quick view"
            className="grid size-11 place-items-center rounded-xl border-[1.5px] border-burgundy/80 bg-ivory text-burgundy transition-colors duration-300 hover:bg-burgundy hover:text-ivory sm:size-12"
          >
            <Eye aria-hidden="true" className="size-5" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </article>
  );
}
