"use client";

import { ArrowRight, Gift, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductPrice } from "@/components/product/ProductPrice";
import { comboDiscount, comboHref, type ComboProduct } from "@/content/combos";

type ComboQuickViewProps = {
  combo: ComboProduct | null;
  onClose: () => void;
};

/**
 * Quick-view dialog built on the native <dialog> element, which provides
 * focus containment, Escape-to-close and an inert background.
 */
export function ComboQuickView({ combo, onClose }: ComboQuickViewProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (combo && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!combo && dialog.open) dialog.close();
  }, [combo]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      document.documentElement.style.overflow = "";
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const discount = combo ? comboDiscount(combo) : null;

  return (
    <dialog
      ref={ref}
      aria-labelledby="combo-quick-view-title"
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="m-auto w-[min(92vw,820px)] max-h-[90dvh] overflow-hidden rounded-2xl border border-gold/40 bg-ivory p-0 text-ink shadow-card backdrop:bg-ink/50 backdrop:backdrop-blur-[2px] open:animate-[combo-dialog-in_0.28s_cubic-bezier(0.22,1,0.36,1)]"
    >
      {combo && (
        <div className="grid max-h-[90dvh] overflow-y-auto sm:grid-cols-[1fr_1.1fr]">
          <div className="relative aspect-[4/3] bg-gradient-to-b from-gold-pale/60 to-cream sm:aspect-auto sm:min-h-full">
            {combo.image ? (
              <Image
                src={combo.image.src}
                alt={combo.image.alt}
                fill
                unoptimized={combo.image.src.endsWith(".svg")}
                sizes="(min-width: 640px) 400px, 92vw"
                className={combo.image.fit === "contain" ? "object-contain p-6" : "object-cover"}
              />
            ) : (
              <span className="flex size-full items-center justify-center text-gold-deep/60">
                <Gift className="size-12" strokeWidth={1.2} />
              </span>
            )}
            {combo.badge && (
              <span className="absolute left-3 top-3 rounded-full bg-burgundy px-2.5 py-1 font-sans text-[0.62rem] font-bold uppercase tracking-[0.12em] text-ivory">
                {combo.badge}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3 p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <h2 id="combo-quick-view-title" className="font-display text-[1.6rem] font-bold leading-tight text-burgundy sm:text-[1.9rem]">
                {combo.name}
              </h2>
              <button
                type="button"
                onClick={() => ref.current?.close()}
                aria-label="Close quick view"
                className="-mr-2 -mt-1 grid size-10 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-gold-pale hover:text-burgundy"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <p className="font-display text-[1.08rem] leading-snug text-ink/85">{combo.description}</p>

            <div>
              <h3 className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-umber">
                What&rsquo;s inside{combo.packSize ? ` · ${combo.packSize}` : ""}
              </h3>
              <ul className="mt-2 space-y-1.5">
                {combo.includedItems.map((item) => (
                  <li key={item.name} className="flex items-center gap-2.5 font-display text-[1.05rem]">
                    <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-gold" />
                    <span className="flex-1">{item.name}</span>
                    {item.quantity && <span className="font-sans text-xs text-umber">{item.quantity}</span>}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <ProductPrice product={combo} />
              {discount !== null && <span className="sr-only">Save {discount}%</span>}
            </div>

            <div className="mt-auto space-y-3 pt-2">
              {combo.availability === "out_of_stock" ? (
                <p className="rounded-xl bg-umber/15 py-3 text-center font-display font-semibold text-umber">Out of Stock</p>
              ) : (
                <AddToCartButton itemKey={`combo:${combo.slug}`} name={combo.name} />
              )}
              <Link
                href={comboHref(combo.slug)}
                className="group inline-flex items-center gap-1.5 font-display text-[1.05rem] font-semibold text-burgundy underline decoration-gold/60 underline-offset-4 hover:decoration-burgundy"
              >
                View full details
                <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
