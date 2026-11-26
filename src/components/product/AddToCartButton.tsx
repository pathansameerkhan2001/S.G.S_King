"use client";

import { Check, ShoppingCart } from "lucide-react";

import { useAddToCart } from "@/lib/cart/useAddToCart";

type AddToCartButtonProps = {
  /** Catalogue item key, e.g. "product:peanut-chikki" or "combo:festive-family-pack". */
  itemKey: string;
  /** Selected size; defaults to the item's first size. */
  variantId?: string;
  /** Name used for the screen-reader label and announcement. */
  name: string;
  quantity?: number;
  className?: string;
};

/** Adds to the shared cart (header count updates instantly). */
export function AddToCartButton({ itemKey, variantId, name, quantity = 1, className = "" }: AddToCartButtonProps) {
  const { status, add } = useAddToCart(itemKey, variantId);
  const added = status === "added";

  return (
    <>
      <button
        type="button"
        onClick={() => add(quantity)}
        className={[
          "group/cart flex h-11 w-full items-center justify-center gap-2 rounded-xl px-2 font-display text-[1rem] font-semibold text-ivory transition-all duration-300 sm:h-12 sm:text-[1.1rem]",
          added
            ? "bg-[#2f7a3d] shadow-[0_10px_22px_-14px_rgba(47,122,61,0.8)]"
            : "bg-burgundy shadow-soft hover:-translate-y-px hover:bg-maroon-light hover:shadow-[0_14px_28px_-14px_rgba(101,10,22,0.6)] active:translate-y-0",
          className,
        ].join(" ")}
      >
        {added ? (
          <Check aria-hidden="true" className="size-[18px]" strokeWidth={2.4} />
        ) : (
          <ShoppingCart
            aria-hidden="true"
            className="size-[18px] transition-transform duration-300 group-hover/cart:-rotate-6"
            strokeWidth={1.9}
          />
        )}
        <span className="whitespace-nowrap">
          {added ? "Added" : "Add to Cart"}
          <span className="sr-only">: {name}</span>
        </span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {added ? `${name} added to cart` : status === "error" ? `${name} is unavailable` : ""}
      </span>
    </>
  );
}
