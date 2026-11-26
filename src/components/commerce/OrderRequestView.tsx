"use client";

import { CheckCircle2, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { business, telHref } from "@/content/contact";
import { clearCart } from "@/lib/cart/store";
import { formatPrice } from "@/lib/format";
import { formatAddress, getOrderRequestSnapshot, orderEmailHref, orderWhatsappHref } from "@/lib/order";

import { OrderSummary } from "./OrderSummary";

const noop = () => () => undefined;

/**
 * Shows the order request created at checkout. Honest by design: the
 * website cannot place orders yet, so the customer confirms by sending the
 * request on WhatsApp or email. No order ID is invented.
 */
export function OrderRequestView() {
  const stored = useSyncExternalStore(noop, getOrderRequestSnapshot, () => null);
  const request = stored?.value ?? null;
  const [cleared, setCleared] = useState(false);

  if (stored === null) return <p className="text-center font-sans text-umber">Loading…</p>;

  if (!request) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-gold/50 bg-ivory/80 px-6 py-12 text-center">
        <h2 className="font-display text-[1.7rem] font-bold text-burgundy">No order request found</h2>
        <p className="mt-2 font-sans text-sm text-umber">Order requests are kept only in this browser tab. Start from your cart to create one.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/cart" className="inline-flex h-12 items-center rounded-xl bg-burgundy px-6 font-display text-[1.05rem] font-semibold text-ivory">
            Go to Cart
          </Link>
          <Link href="/shop" className="inline-flex h-12 items-center rounded-xl border-[1.5px] border-burgundy px-6 font-display text-[1.05rem] font-semibold text-burgundy">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const { details, items, summary } = request;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
      <div className="space-y-6">
        <section className="rounded-2xl border border-gold/40 bg-ivory p-6 text-center sm:p-8">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#e7f4ea] text-[#2f7a3d]">
            <CheckCircle2 aria-hidden="true" className="size-9" strokeWidth={1.6} />
          </span>
          <h2 className="mt-4 font-display text-[1.9rem] font-bold text-burgundy">Your order request is ready</h2>
          <p className="mx-auto mt-2 max-w-xl font-sans text-[0.95rem] leading-relaxed text-ink/85">
            Thank you, {details.fullName.split(" ")[0]}! Online ordering isn&rsquo;t live on our website yet, so{" "}
            <strong>your order has not been placed</strong>. Send this request to us on WhatsApp or email and we&rsquo;ll confirm availability,
            delivery charges and payment with you.
          </p>
          <p className="mt-3 font-sans text-sm text-umber">
            Order ID: <span className="font-semibold">assigned when we confirm your order</span>
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href={orderWhatsappHref(request)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] font-display text-[1.1rem] font-semibold text-white hover:brightness-105"
            >
              <WhatsAppIcon className="size-5" />
              Send on WhatsApp
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a
              href={orderEmailHref(request)}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-[1.5px] border-burgundy font-display text-[1.1rem] font-semibold text-burgundy hover:bg-gold-pale"
            >
              <Mail aria-hidden="true" className="size-5" />
              Send by Email
            </a>
          </div>
          <div className="mt-5 border-t border-gold/25 pt-4">
            {cleared ? (
              <p role="status" className="font-sans text-sm font-semibold text-[#2f7a3d]">
                Cart cleared.
              </p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setCleared(true);
                }}
                className="min-h-11 font-sans text-sm font-semibold text-burgundy underline underline-offset-4"
              >
                I&rsquo;ve sent my order: clear my cart
              </button>
            )}
          </div>
        </section>

        <section aria-labelledby="ordered-items" className="rounded-2xl border border-gold/30 bg-ivory p-5 sm:p-6">
          <h2 id="ordered-items" className="font-display text-[1.4rem] font-bold text-burgundy">
            Items
          </h2>
          <ul className="mt-3 divide-y divide-gold/20">
            {items.map((i) => (
              <li key={`${i.name}-${i.variant}`} className="flex justify-between gap-4 py-2.5 font-sans text-sm">
                <span>
                  <span className="font-semibold text-ink">{i.name}</span> <span className="text-umber">({i.variant}) × {i.quantity}</span>
                </span>
                <span className="font-semibold">{formatPrice(i.lineTotal)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="delivery-address" className="rounded-2xl border border-gold/30 bg-ivory p-5 sm:p-6">
          <h2 id="delivery-address" className="font-display text-[1.4rem] font-bold text-burgundy">
            Delivery address
          </h2>
          <p className="mt-2 font-sans text-sm leading-relaxed text-ink/85">
            <span className="font-semibold">{details.fullName}</span> · {details.phone}
            {details.email && ` · ${details.email}`}
            <br />
            <span className="capitalize">{details.addressType}</span>: {formatAddress(details)}
          </p>
        </section>
      </div>

      <div className="space-y-4 lg:sticky lg:top-28">
        <OrderSummary summary={summary} title="Request Summary" />
        <section className="rounded-2xl border border-gold/30 bg-ivory p-5">
          <h2 className="font-display text-[1.3rem] font-bold text-burgundy">Need help?</h2>
          <ul className="mt-2 space-y-1 font-sans text-sm">
            <li>
              <a href={telHref(business.phones[0])} className="inline-flex min-h-10 items-center gap-2 hover:text-burgundy">
                <Phone aria-hidden="true" className="size-4 text-gold-deep" />
                {business.phones[0]}
              </a>
            </li>
            <li>
              <Link href="/contact" className="inline-flex min-h-10 items-center gap-2 hover:text-burgundy">
                <MessageCircle aria-hidden="true" className="size-4 text-gold-deep" />
                Contact support
              </Link>
            </li>
          </ul>
          <Link href="/shop" className="mt-3 flex h-11 items-center justify-center rounded-xl border-[1.5px] border-burgundy font-display font-semibold text-burgundy hover:bg-gold-pale">
            Continue Shopping
          </Link>
        </section>
      </div>
    </div>
  );
}
