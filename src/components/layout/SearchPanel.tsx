"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useRef, type RefObject } from "react";

import { categories } from "@/content/categories";
import { routes } from "@/content/site";

type SearchPanelProps = {
  open: boolean;
  id: string;
  onClose: () => void;
  panelRef: RefObject<HTMLDivElement | null>;
};

const suggestions = categories.slice(0, 5);

/**
 * Drop-down search bar under the header.
 * UI-ready: submits `?q=` to the shop route; product search is not
 * connected to a backend yet.
 */
export function SearchPanel({ open, id, onClose, panelRef }: SearchPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id={id}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-full z-30 border-y border-gold/25 bg-ivory/97 shadow-card backdrop-blur"
        >
          <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:py-6">
            <form action={routes.search} method="get" role="search" className="flex items-center gap-2">
              <label htmlFor={`${id}-input`} className="sr-only">
                Search dry fruits
              </label>
              <div className="relative flex-1">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-umber"
                />
                <input
                  ref={inputRef}
                  id={`${id}-input`}
                  name="q"
                  type="search"
                  autoComplete="off"
                  placeholder="Search almonds, cashews, dates…"
                  className="h-12 w-full rounded-xl border border-gold/45 bg-white/70 pl-12 pr-4 font-sans text-[0.95rem] text-ink placeholder:text-umber/70 focus:border-burgundy focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-gold/40"
                />
              </div>
              <button
                type="submit"
                className="h-12 rounded-xl bg-burgundy px-5 font-display text-lg font-semibold text-ivory transition-colors hover:bg-maroon-light"
              >
                Search
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="grid size-11 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-gold-pale hover:text-burgundy"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </form>
            <div className="mt-3 flex flex-wrap items-center gap-2 font-sans text-xs text-umber">
              <span className="font-semibold uppercase tracking-[0.16em]">Popular:</span>
              {suggestions.map((c) => (
                <a
                  key={c.slug}
                  href={`${routes.search}?q=${encodeURIComponent(c.name)}`}
                  className="rounded-full border border-gold/40 px-3 py-1 text-ink transition-colors hover:border-burgundy hover:text-burgundy"
                >
                  {c.name}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
