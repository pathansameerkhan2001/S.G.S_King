"use client";

import { Gift, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductPrice } from "@/components/product/ProductPrice";
import { ShareProductButton } from "@/components/product/ShareProductButton";
import { WishlistButton } from "@/components/product/WishlistButton";
import { discountPercent } from "@/content/products";
import { categoryName, getVariant, type CatalogItem } from "@/lib/catalog";

/**
 * Card for any catalogue item (product or combo), used by the shop,
 * category, search, wishlist and related-product grids.
 */
export function CatalogProductCard({ item, headingLevel = "h3" }: { item: CatalogItem; headingLevel?: "h2" | "h3" }) {
  const [variantId, setVariantId] = useState(item.variants[0].id);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const variant = getVariant(item, variantId);
  const discount = discountPercent(variant);
  const image = item.images[0];
  const soldOut = item.availability === "out_of_stock";
  const Heading = headingLevel;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gold/30 bg-ivory shadow-[0_12px_32px_-22px_rgba(53,23,15,0.5)] transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:hover:-translate-y-1 hover:border-gold/70 hover:shadow-[0_24px_44px_-24px_rgba(101,10,22,0.45)]">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-gold-pale/60 to-cream">
        <Link href={item.href} tabIndex={-1} aria-hidden="true" className="absolute inset-0">
          {image ? (
            <Image
              src={image.src}
              alt=""
              fill
              unoptimized={image.src.endsWith(".svg")}
              sizes="(min-width: 1280px) 280px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 48vw"
              className={`transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] ${
                image.fit === "contain" ? "object-contain p-4" : "object-cover"
              }`}
            />
          ) : (
            <span className="flex size-full flex-col items-center justify-center gap-2 text-gold-deep/60">
              {item.kind === "combo" ? <Gift className="size-8" strokeWidth={1.2} /> : <ImageIcon className="size-8" strokeWidth={1.2} />}
              <span className="font-sans text-[0.62rem] uppercase tracking-[0.2em]">Image coming soon</span>
            </span>
          )}
        </Link>

        <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-1 sm:left-3 sm:top-3 sm:gap-1.5">
          {item.badge && (
            <span className="rounded-full bg-burgundy px-2 py-0.5 font-sans text-[0.55rem] font-bold uppercase tracking-[0.08em] text-ivory shadow-sm sm:px-2.5 sm:py-1 sm:text-[0.6rem] sm:tracking-[0.12em]">
              {item.badge}
            </span>
          )}
          {discount !== null && (
            <span className="rounded-full bg-gold px-2 py-0.5 font-sans text-[0.6rem] font-bold text-ink shadow-sm sm:px-2.5 sm:py-1 sm:text-[0.65rem]">
              -{discount}%
            </span>
          )}
        </div>

        <div className="absolute right-2 top-2 flex flex-col gap-1.5 sm:right-3 sm:top-3 sm:gap-2">
          <WishlistButton itemKey={item.key} productName={item.name} />
          <ShareProductButton productName={item.name} path={item.href} onStatus={setShareStatus} />
        </div>

        {item.availability !== "in_stock" && (
          <span
            className={`pointer-events-none absolute bottom-2 left-2 rounded-full px-2.5 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.1em] shadow-sm ${
              soldOut ? "bg-ink/85 text-ivory" : "bg-ivory/90 text-burgundy"
            }`}
          >
            {soldOut ? "Out of stock" : "Few left"}
          </span>
        )}

        <p
          role="status"
          aria-live="polite"
          className={`pointer-events-none absolute inset-x-2 bottom-2 rounded-full bg-ink/85 px-3 py-1.5 text-center font-sans text-xs font-medium text-ivory transition-all duration-300 ${
            shareStatus ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          {shareStatus}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-gold-deep sm:text-[0.66rem]">
          {item.kind === "combo" ? "Combo Pack" : categoryName(item.categorySlug)}
        </p>
        <Heading className="-mt-1 font-display text-[1.05rem] font-semibold leading-tight text-ink sm:text-[1.2rem]">
          <Link href={item.href} className="inline-block py-1 transition-colors hover:text-burgundy">
            {item.name}
          </Link>
        </Heading>

        {/* Size selection (updates price); single size shows as a pill */}
        {item.variants.length > 1 ? (
          <div role="radiogroup" aria-label={`Size for ${item.name}`} className="flex flex-wrap gap-1.5">
            {item.variants.map((v) => {
              const checked = v.id === variant.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => setVariantId(v.id)}
                  className={`min-h-8 rounded-full border px-2.5 font-sans text-[0.7rem] font-semibold transition-colors ${
                    checked ? "border-burgundy bg-burgundy text-ivory" : "border-gold/50 text-umber hover:border-burgundy"
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        ) : (
          <p>
            <span className="inline-block rounded-full border border-gold/45 bg-gold-pale/60 px-2.5 py-0.5 font-sans text-[0.7rem] font-semibold text-umber">
              <span className="sr-only">Size: </span>
              {variant.label}
            </span>
          </p>
        )}

        <ProductPrice product={variant} />

        <div className="mt-auto pt-1.5">
          {soldOut ? (
            <button type="button" disabled className="h-11 w-full rounded-xl bg-umber/20 font-display font-semibold text-umber sm:h-12">
              Out of Stock
            </button>
          ) : (
            <AddToCartButton itemKey={item.key} variantId={variant.id} name={`${item.name} (${variant.label})`} />
          )}
        </div>
      </div>
    </article>
  );
}
