"use client";

import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { discountPercent, productHref, type Product } from "@/content/products";

import { AddToCartButton } from "./AddToCartButton";
import { ProductPrice } from "./ProductPrice";
import { ProductRating } from "./ProductRating";
import { ShareProductButton } from "./ShareProductButton";
import { WishlistButton } from "./WishlistButton";

type BestSellerProductCardProps = {
  product: Product;
  showWishlist?: boolean;
};

export function BestSellerProductCard({ product, showWishlist = true }: BestSellerProductCardProps) {
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const href = productHref(product.slug);
  const discount = discountPercent(product);
  const { image } = product;

  return (
    <article
      className={[
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gold/30 bg-ivory",
        "shadow-[0_12px_32px_-22px_rgba(53,23,15,0.5)] transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1 hover:border-gold/70 hover:shadow-[0_24px_44px_-24px_rgba(101,10,22,0.45)]",
      ].join(" ")}
    >
      {/* Image area: fixed 1:1 ratio, so no layout shift */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-gold-pale/60 to-cream">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0">
          {image ? (
            <Image
              src={image.src}
              alt=""
              fill
              unoptimized={image.src.endsWith(".svg")}
              sizes="(min-width: 1280px) 300px, (min-width: 1024px) 23vw, 48vw"
              className={`transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] ${
                image.fit === "contain" ? "object-contain p-4" : "object-cover"
              }`}
            />
          ) : (
            <span className="flex size-full flex-col items-center justify-center gap-2 text-gold-deep/60">
              <ImageIcon className="size-8" strokeWidth={1.2} />
              <span className="font-sans text-[0.65rem] uppercase tracking-[0.2em]">Image coming soon</span>
            </span>
          )}
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-1 min-[400px]:left-2.5 min-[400px]:top-2.5 min-[400px]:gap-1.5 sm:left-3 sm:top-3">
          {product.isBestseller && (
            <span className="rounded-full bg-burgundy px-2 py-0.5 font-sans text-[0.55rem] font-bold uppercase tracking-[0.08em] min-[400px]:px-2.5 min-[400px]:py-1 min-[400px]:text-[0.6rem] min-[400px]:tracking-[0.14em] text-ivory shadow-sm sm:text-[0.65rem]">
              Bestseller
            </span>
          )}
          {discount !== null && (
            <span className="rounded-full bg-gold px-2 py-0.5 font-sans text-[0.55rem] font-bold uppercase tracking-[0.06em] min-[400px]:px-2.5 min-[400px]:py-1 min-[400px]:text-[0.6rem] min-[400px]:tracking-[0.1em] text-ink shadow-sm sm:text-[0.65rem]">
              {discount}% off
            </span>
          )}
        </div>

        {/* Wishlist + share */}
        <div className="absolute right-2 top-2 flex flex-col gap-1.5 min-[400px]:right-2.5 min-[400px]:top-2.5 min-[400px]:gap-2 sm:right-3 sm:top-3">
          {showWishlist && <WishlistButton itemKey={`product:${product.slug}`} productName={product.name} />}
          <ShareProductButton productName={product.name} path={href} onStatus={setShareStatus} />
        </div>

        {/* Share feedback */}
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
      <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-2.5 sm:p-4 xl:p-5">
        <h3 className="font-display text-[1.05rem] font-semibold leading-tight text-ink min-[400px]:text-[1.12rem] sm:text-[1.3rem]">
          <Link href={href} className="transition-colors hover:text-burgundy">
            {product.name}
          </Link>
        </h3>

        <ProductRating rating={product.rating} />

        <p>
          <span className="sr-only">Pack size: </span>
          <span className="inline-block rounded-full border border-gold/45 bg-gold-pale/60 px-2.5 py-0.5 font-sans text-[0.7rem] font-semibold text-umber sm:text-xs">
            {product.variant}
          </span>
        </p>

        <ProductPrice product={product} />

        <div className="mt-auto pt-1.5 sm:pt-2">
          <AddToCartButton itemKey={`product:${product.slug}`} name={product.name} />
        </div>
      </div>
    </article>
  );
}
