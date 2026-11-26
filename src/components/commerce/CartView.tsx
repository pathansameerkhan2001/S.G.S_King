"use client";

import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";

import { commerce } from "@/content/commerce";
import { removeFromCart, setQuantity, useCart } from "@/lib/cart/store";
import { formatPrice } from "@/lib/format";

import { LineThumb } from "./LineThumb";
import { OrderSummary } from "./OrderSummary";

export function CartView() {
  const { resolved, summary } = useCart();

  if (resolved.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-gold/50 bg-ivory/80 px-6 py-14 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-gold-pale text-burgundy">
          <ShoppingCart aria-hidden="true" className="size-7" strokeWidth={1.5} />
        </span>
        <h2 className="mt-4 font-display text-[1.8rem] font-bold text-burgundy">Your cart is empty</h2>
        <p className="mt-2 font-sans text-sm text-umber">Add traditional laddus, chikkis, honey and more to get started.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-burgundy px-7 font-display text-[1.1rem] font-semibold text-ivory hover:bg-maroon-light"
        >
          Start Shopping
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
      <section aria-labelledby="cart-items-heading">
        <h2 id="cart-items-heading" className="sr-only">
          Cart items
        </h2>
        <ul className="divide-y divide-gold/25 rounded-2xl border border-gold/30 bg-ivory">
          {resolved.map(({ id, item, variant, line, lineTotal }) => (
            <li key={id} className="flex gap-3 p-4 sm:gap-5 sm:p-5">
              <LineThumb item={item} />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={item.href} className="font-display text-[1.15rem] font-semibold leading-tight text-ink hover:text-burgundy sm:text-[1.25rem]">
                      {item.name}
                    </Link>
                    <p className="font-sans text-xs text-umber">
                      {item.kind === "combo" ? "Combo pack" : "Size"}: {variant.label}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(id)}
                    aria-label={`Remove ${item.name} (${variant.label}) from cart`}
                    className="grid size-10 shrink-0 place-items-center rounded-full text-umber transition-colors hover:bg-gold-pale hover:text-burgundy"
                  >
                    <Trash2 aria-hidden="true" className="size-[18px]" />
                  </button>
                </div>
                <p className="font-sans text-sm">
                  <span className="font-semibold text-burgundy">{formatPrice(variant.price)}</span>
                  {variant.mrp && variant.mrp > variant.price && (
                    <span className="ml-2 text-umber/80 line-through">{formatPrice(variant.mrp)}</span>
                  )}
                </p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                  <div className="flex h-10 items-center rounded-xl border border-gold/50" role="group" aria-label={`Quantity of ${item.name}`}>
                    <button
                      type="button"
                      onClick={() => (line.quantity <= 1 ? removeFromCart(id) : setQuantity(id, line.quantity - 1))}
                      aria-label={line.quantity <= 1 ? "Remove item" : "Decrease quantity"}
                      className="grid size-10 place-items-center text-burgundy"
                    >
                      <Minus aria-hidden="true" className="size-4" />
                    </button>
                    <output aria-live="polite" className="w-8 text-center font-sans text-sm font-semibold">
                      {line.quantity}
                    </output>
                    <button
                      type="button"
                      onClick={() => setQuantity(id, line.quantity + 1)}
                      disabled={line.quantity >= commerce.maxQuantity}
                      aria-label="Increase quantity"
                      className="grid size-10 place-items-center text-burgundy disabled:opacity-40"
                    >
                      <Plus aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                  <p className="font-display text-[1.25rem] font-bold text-ink">{formatPrice(lineTotal)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/shop" className="mt-5 inline-flex min-h-11 items-center gap-2 font-display text-[1.08rem] font-semibold text-burgundy hover:underline">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Continue shopping
        </Link>
      </section>

      <div className="lg:sticky lg:top-28">
        <OrderSummary summary={summary}>
          <Link
            href="/checkout"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-burgundy font-display text-[1.15rem] font-semibold text-ivory shadow-soft hover:bg-maroon-light"
          >
            Proceed to Checkout
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </OrderSummary>
      </div>
    </div>
  );
}
