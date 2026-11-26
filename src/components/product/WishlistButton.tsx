"use client";

import { Heart } from "lucide-react";

import { useWishlist } from "@/lib/wishlist";

import { cornerButton } from "./styles";

export function WishlistButton({ productId, productName }: { productId: string; productName: string }) {
  const { isSaved, toggle } = useWishlist(productId);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isSaved}
      aria-label={isSaved ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
      className={cornerButton}
    >
      <Heart
        aria-hidden="true"
        strokeWidth={1.8}
        className={`size-[18px] transition-transform duration-300 ${
          isSaved ? "scale-110 fill-burgundy text-burgundy" : ""
        }`}
      />
    </button>
  );
}
