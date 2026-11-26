"use client";

import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type ProductCarouselProps = {
  label: string;
  /** Each item is rendered inside its own snap slide. */
  items: { key: string; node: ReactNode }[];
  /** Changing this value scrolls the track back to the start (e.g. on filter change). */
  resetKey?: string;
};

/**
 * Generic horizontal product carousel: native scroll + snap (natural touch
 * swipe), arrows on md+ that move one card and hide at either end.
 * Slide widths: mobile ≈ 1.25, sm ≈ 2.25, lg ≈ 3.25, xl exactly 4.
 */
const slideWidth = [
  "w-[80%]",
  "sm:w-[calc((100%-1rem)/2.25)]",
  "lg:w-[calc((100%-2*1.25rem)/3.25)]",
  "xl:w-[calc((100%-3*1.5rem)/4)]",
].join(" ");

const arrow =
  "absolute top-[30%] z-10 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-gold/50 bg-ivory/95 text-burgundy shadow-[0_8px_20px_-10px_rgba(101,10,22,0.55)] backdrop-blur-sm transition-[opacity,background-color,color] duration-300 hover:border-burgundy hover:bg-burgundy hover:text-ivory disabled:pointer-events-none disabled:opacity-0 md:grid";

export function ProductCarousel({ label, items, resetKey }: ProductCarouselProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

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
  }, [items.length]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0 });
  }, [resetKey]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    const [first, second] = Array.from(el?.children ?? []) as HTMLElement[];
    if (!el || !first) return;
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    el.scrollBy({ left: direction * step, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className="relative">
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        disabled={edges.start}
        aria-label={`Previous ${label.toLowerCase()}`}
        className={`${arrow} -left-3 xl:-left-5`}
      >
        <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.8} />
      </button>

      <ul
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain py-4 [scrollbar-width:none] sm:gap-4 lg:gap-5 xl:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <li
            key={item.key}
            className={`shrink-0 snap-start ${slideWidth}`}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${items.length}`}
          >
            {item.node}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => scrollByCard(1)}
        disabled={edges.end}
        aria-label={`Next ${label.toLowerCase()}`}
        className={`${arrow} -right-3 xl:-right-5`}
      >
        <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.8} />
      </button>
    </div>
  );
}
