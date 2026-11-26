"use client";

import { Heart } from "lucide-react";

import { useWishlist } from "@/lib/wishlist";

import { cornerButton } from "./styles";

type WishlistButtonProps = {
  /** Catalogue item key, e.g. "product:peanut-chikki". */
  itemKey: string;
  productName: string;
  className?: string;
};

export function WishlistButton({ itemKey, productName, className = cornerButton }: WishlistButtonProps) {
  const { isSaved, toggle } = useWishlist(itemKey);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
      className={className}
    >
      <Heart
        aria-hidden="true"
        strokeWidth={1.8}
        className={`size-[18px] transition-transform duration-300 ${isSaved ? "scale-110 fill-burgundy text-burgundy" : ""}`}
      />
    </button>
  );
}
