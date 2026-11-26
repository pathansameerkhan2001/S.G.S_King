"use client";

import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ComboProductCard } from "@/components/product/ComboProductCard";
import type { ComboProduct } from "@/content/combos";

import { ComboQuickView } from "./ComboQuickView";

/**
 * Card widths leave the next card peeking in:
 * mobile ≈ 1.25 cards, sm ≈ 2.25, lg ≈ 3.25, xl ≈ 4.2.
 */
const cardWidth = [
  "w-[80%]",
  "sm:w-[calc((100%-1rem)/2.25)]",
  "lg:w-[calc((100%-2*1.25rem)/3.25)]",
  "xl:w-[calc((100%-3*1.5rem)/4.2)]",
].join(" ");

const arrow =
  "absolute top-[30%] z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-gold/50 bg-ivory/95 text-burgundy shadow-[0_8px_20px_-10px_rgba(101,10,22,0.55)] backdrop-blur-sm transition-[opacity,background-color,color] duration-300 hover:border-burgundy hover:bg-burgundy hover:text-ivory disabled:pointer-events-none disabled:opacity-0 md:grid";

export function ComboCarousel({ combos }: { combos: ComboProduct[] }) {
  const reduceMotion = useReducedMotion() ?? false;
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [quickView, setQuickView] = useState<ComboProduct | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Track whether we can scroll further in each direction.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const start = el.scrollLeft <= 4;
        const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
        setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
      });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  /** Scroll by one card (including gap) in the given direction. */
  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    const [first, second] = Array.from(el?.children ?? []) as HTMLElement[];
    if (!el || !first) return;
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    el.scrollBy({ left: direction * step, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const openQuickView = useCallback((combo: ComboProduct, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setQuickView(combo);
  }, []);

  const closeQuickView = useCallback(() => {
    setQuickView(null);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Combo products" className="relative">
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        disabled={edges.start}
        aria-label="Previous combos"
        className={`${arrow} -left-3 xl:-left-5`}
      >
        <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.8} />
      </button>

      <ul
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain py-4 [scrollbar-width:none] sm:gap-4 lg:gap-5 xl:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {combos.map((combo, index) => (
          <li
            key={combo.id}
            className={`shrink-0 snap-start ${cardWidth}`}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${combos.length}`}
          >
            <ComboProductCard combo={combo} onQuickView={openQuickView} />
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => scrollByCard(1)}
        disabled={edges.end}
        aria-label="Next combos"
        className={`${arrow} -right-3 xl:-right-5`}
      >
        <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.8} />
      </button>

      <ComboQuickView combo={quickView} onClose={closeQuickView} />
    </div>
  );
}
