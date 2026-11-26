"use client";

import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { CatalogProductCard } from "@/components/catalog/CatalogProductCard";
import { addToCart } from "@/lib/cart/store";
import { getItemByKey, type CatalogItem } from "@/lib/catalog";
import { removeFromWishlist, useWishlistKeys } from "@/lib/wishlist";

/** Wishlist page body: same cards (and shared wishlist state) as the shop, plus "Move to cart". */
export function WishlistView() {
  const keys = useWishlistKeys();
  const items = useMemo(() => keys.map(getItemByKey).filter((x): x is CatalogItem => !!x), [keys]);
  const [message, setMessage] = useState("");

  const moveToCart = (item: CatalogItem) => {
    if (addToCart(item.key, item.variants[0].id, 1)) {
      removeFromWishlist(item.key);
      setMessage(`${item.name} moved to your cart.`);
    } else {
      setMessage(`${item.name} is currently unavailable.`);
    }
  };

  return (
    <>
      <p role="status" aria-live="polite" className="sr-only">
        {message}
      </p>
      {items.length === 0 ? (
        <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-gold/50 bg-ivory/80 px-6 py-14 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-gold-pale text-burgundy">
            <Heart aria-hidden="true" className="size-7" strokeWidth={1.5} />
          </span>
          <h2 className="mt-4 font-display text-[1.8rem] font-bold text-burgundy">Your wishlist is empty</h2>
          <p className="mt-2 font-sans text-sm text-umber">Tap the heart on any product to save it here.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-12 items-center rounded-xl bg-burgundy px-7 font-display text-[1.1rem] font-semibold text-ivory hover:bg-maroon-light"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-4 font-sans text-sm text-umber">
            {items.length} saved {items.length === 1 ? "item" : "items"} · Saved on this device
          </p>
          <ul aria-label="Saved items" className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
            {items.map((item) => (
              <li key={item.key} className="flex min-w-0 flex-col gap-2">
                <div className="flex-1">
                  <CatalogProductCard item={item} />
                </div>
                {item.availability !== "out_of_stock" && (
                  <button
                    type="button"
                    onClick={() => moveToCart(item)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border-[1.5px] border-burgundy bg-ivory font-display text-[1rem] font-semibold text-burgundy transition-colors hover:bg-gold-pale"
                  >
                    <ShoppingCart aria-hidden="true" className="size-4" />
                    Move to Cart
                    <span className="sr-only">: {item.name}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      <Link href="/shop" className="mt-8 inline-flex min-h-11 items-center gap-2 font-display text-[1.08rem] font-semibold text-burgundy hover:underline">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Continue shopping
      </Link>
    </>
  );
}
