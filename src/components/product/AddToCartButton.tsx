"use client";

import { Check, Loader2, ShoppingCart } from "lucide-react";

import type { Product } from "@/content/products";
import { useAddToCart } from "@/lib/cart/useAddToCart";

/** Add to Cart button. Cart logic lives in useAddToCart (demo for now). */
export function AddToCartButton({ product }: { product: Pick<Product, "id" | "name"> }) {
  const { status, add } = useAddToCart(product);
  const adding = status === "adding";
  const added = status === "added";

  return (
    <>
      <button
        type="button"
        onClick={() => add()}
        disabled={adding}
        className={[
          "group/cart flex h-11 w-full items-center justify-center gap-2 rounded-xl px-2 font-display text-[1rem] font-semibold text-ivory transition-all duration-300 sm:h-12 sm:text-[1.1rem]",
          "disabled:cursor-wait",
          added
            ? "bg-[#2f7a3d] shadow-[0_10px_22px_-14px_rgba(47,122,61,0.8)]"
            : "bg-burgundy shadow-soft hover:-translate-y-px hover:bg-maroon-light hover:shadow-[0_14px_28px_-14px_rgba(101,10,22,0.6)] active:translate-y-0",
        ].join(" ")}
      >
        {adding ? (
          <Loader2 aria-hidden="true" className="size-[18px] animate-spin" />
        ) : added ? (
          <Check aria-hidden="true" className="size-[18px]" strokeWidth={2.4} />
        ) : (
          <ShoppingCart
            aria-hidden="true"
            className="size-[18px] transition-transform duration-300 group-hover/cart:-rotate-6"
            strokeWidth={1.9}
          />
        )}
        <span className="whitespace-nowrap">
          {added ? "Added" : adding ? "Adding…" : "Add to Cart"}
          <span className="sr-only">: {product.name}</span>
        </span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {added ? `${product.name} added to cart` : status === "error" ? "Could not add to cart" : ""}
      </span>
    </>
  );
}
