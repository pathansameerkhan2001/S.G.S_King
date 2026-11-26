"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";

import { LeafSprig } from "@/components/decor/Ornaments";
import { categories, categoryHref, routes } from "@/content/site";
import { useDismiss } from "@/hooks/useDismiss";

type CategoryDropdownProps = {
  label: string;
  active: boolean;
  linkClassName: string;
};

const HOVER_CLOSE_DELAY = 160;

export function CategoryDropdown({ label, active, linkClassName }: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const close = useCallback(() => setOpen(false), []);
  const dismissRefs = useMemo(() => [wrapperRef], []);
  useDismiss(open, dismissRefs, close);

  useEffect(() => clearTimer, []);

  const focusItem = (index: number) => {
    const items = wrapperRef.current?.querySelectorAll<HTMLAnchorElement>("[data-menu-item]");
    if (!items?.length) return;
    const i = (index + items.length) % items.length;
    items[i]?.focus();
  };

  const onButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    }
  };

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      wrapperRef.current?.querySelectorAll<HTMLAnchorElement>("[data-menu-item]") ?? [],
    );
    const current = items.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      focusItem(current + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      focusItem(current - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusItem(items.length - 1);
    } else if (event.key === "Escape") {
      event.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        clearTimer();
        setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        clearTimer();
        closeTimer.current = setTimeout(close, HOVER_CLOSE_DELAY);
      }}
      onBlur={(e) => {
        if (!wrapperRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onButtonKeyDown}
        className={`${linkClassName} inline-flex items-center gap-1.5`}
        data-active={active || undefined}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          strokeWidth={2}
          className={`size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={onPanelKeyDown}
            className="absolute left-1/2 top-full z-50 w-[600px] -translate-x-1/2 pt-5"
          >
            <div className="relative overflow-hidden rounded-2xl border border-gold/35 bg-ivory shadow-card">
              {/* Gold hairline at the top */}
              <div aria-hidden="true" className="h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
              <div className="grid grid-cols-[1fr_200px]">
                <nav aria-label="Dry fruit categories" className="p-5">
                  <p className="mb-3 px-3 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-umber">
                    Shop by category
                  </p>
                  <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                    {categories.map((category) => (
                      <li key={category.slug}>
                        <Link
                          href={categoryHref(category.slug)}
                          data-menu-item
                          onClick={close}
                          className="group flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 font-display text-[1.1rem] text-ink transition-colors hover:bg-gold-pale hover:text-burgundy focus-visible:bg-gold-pale focus-visible:text-burgundy"
                        >
                          <span
                            aria-hidden="true"
                            className="size-1.5 rotate-45 bg-gold/60 transition-colors group-hover:bg-burgundy"
                          />
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="flex flex-col justify-between border-l border-gold/25 bg-gradient-to-b from-gold-pale/70 to-cream p-5">
                  <div>
                    <LeafSprig className="mb-2 h-4 w-6 text-gold" />
                    <p className="font-display text-lg font-semibold leading-snug text-burgundy">
                      Handpicked &amp; hygienically packed
                    </p>
                    <p className="mt-1.5 font-sans text-xs leading-relaxed text-umber">
                      Premium dry fruits, packed fresh from Kadapa, Rayalaseema.
                    </p>
                  </div>
                  <Link
                    href={routes.shop}
                    data-menu-item
                    onClick={close}
                    className="group mt-4 inline-flex items-center gap-1.5 font-display text-base font-semibold text-burgundy underline decoration-gold/60 underline-offset-4 hover:decoration-burgundy"
                  >
                    View all
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
