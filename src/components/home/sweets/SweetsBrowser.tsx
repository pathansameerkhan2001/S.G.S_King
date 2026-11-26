"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { ProductCarousel } from "@/components/product/ProductCarousel";
import { QuickViewDialog } from "@/components/product/QuickViewDialog";
import { SweetProductCard } from "@/components/product/SweetProductCard";
import { sweetFilters, type SweetCategory, type SweetProduct } from "@/content/sweets";

import { SWEET_QUICK_VIEW_TITLE_ID, SweetQuickView } from "./SweetQuickView";

type FilterId = SweetCategory | "all";

/** Filter chips + carousel + quick view for the Sweets & Chikkis section. */
export function SweetsBrowser({ products }: { products: SweetProduct[] }) {
  const [filter, setFilter] = useState<FilterId>("all");
  const [quickView, setQuickView] = useState<SweetProduct | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Only offer filters that have at least one product.
  const filters = useMemo(
    () => sweetFilters.filter((f) => f.id === "all" || products.some((p) => p.categories.includes(f.id as SweetCategory))),
    [products],
  );

  const visible = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.categories.includes(filter))),
    [filter, products],
  );

  const openQuickView = useCallback((product: SweetProduct, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setQuickView(product);
  }, []);

  const closeQuickView = useCallback(() => {
    setQuickView(null);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      {/* Filter chips: scroll sideways on small screens instead of wrapping */}
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div role="group" aria-label="Filter sweets and chikkis" className="mx-auto flex w-max gap-2">
          {filters.map((f) => {
            const active = f.id === filter;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f.id)}
                className={`h-10 whitespace-nowrap rounded-full border px-4 font-sans text-[0.82rem] font-semibold transition-colors duration-300 sm:px-5 ${
                  active
                    ? "border-burgundy bg-burgundy text-ivory shadow-soft"
                    : "border-gold/50 bg-ivory text-umber hover:border-burgundy hover:text-burgundy"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {visible.length} {visible.length === 1 ? "product" : "products"} shown
      </p>

      <div className="mt-3 sm:mt-4">
        {visible.length > 0 ? (
          <ProductCarousel
            label="Sweets and chikkis"
            resetKey={filter}
            items={visible.map((product) => ({
              key: product.id,
              node: <SweetProductCard product={product} onQuickView={openQuickView} />,
            }))}
          />
        ) : (
          <p className="py-10 text-center font-display text-lg text-umber">No products in this category yet.</p>
        )}
      </div>

      <QuickViewDialog open={quickView !== null} onClose={closeQuickView} labelledBy={SWEET_QUICK_VIEW_TITLE_ID}>
        {quickView && <SweetQuickView key={quickView.id} product={quickView} />}
      </QuickViewDialog>
    </>
  );
}
