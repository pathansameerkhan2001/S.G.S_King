"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import type { RefObject } from "react";

import { routes } from "@/content/site";

type CartPreviewProps = {
  open: boolean;
  id: string;
  count: number;
  onClose: () => void;
  panelRef: RefObject<HTMLDivElement | null>;
};

/**
 * Mini-cart popover. UI-only for now: there is no cart backend yet, so it
 * always shows the empty state when `count` is 0.
 */
export function CartPreview({ open, id, count, onClose, panelRef }: CartPreviewProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id={id}
          role="dialog"
          aria-label="Shopping cart"
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-0 top-full z-50 mt-3 w-[min(20rem,calc(100vw-2rem))] origin-top-right overflow-hidden rounded-2xl border border-gold/35 bg-ivory shadow-card"
        >
          <div aria-hidden="true" className="h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
          <div className="p-5 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-gold-pale text-burgundy">
              <ShoppingCart aria-hidden="true" className="size-6" strokeWidth={1.6} />
            </span>
            {count === 0 ? (
              <>
                <p className="mt-3 font-display text-xl font-semibold text-burgundy">Your cart is empty</p>
                <p className="mt-1 font-sans text-sm text-umber">
                  Add premium almonds, cashews, dates and more.
                </p>
              </>
            ) : (
              <p className="mt-3 font-display text-xl font-semibold text-burgundy">
                {count} {count === 1 ? "item" : "items"} in your cart
              </p>
            )}
            <Link
              href={count === 0 ? routes.shop : routes.cart}
              onClick={onClose}
              className="group mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-burgundy font-display text-lg font-semibold text-ivory transition-colors hover:bg-maroon-light"
            >
              {count === 0 ? "Explore Dry Fruits" : "View Cart"}
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
