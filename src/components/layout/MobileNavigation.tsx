"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MapPin, ShoppingBag, Truck, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { GoldFlourish } from "@/components/decor/Ornaments";
import { categories, categoriesBasePath, categoryHref } from "@/content/categories";
import { brand, navigation, routes } from "@/content/site";
import { isActivePath } from "@/lib/nav";

import { Logo } from "./Logo";

type MobileNavigationProps = {
  open: boolean;
  id: string;
  onClose: () => void;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Slide-in drawer navigation for screens below `lg`.
 * Accessible modal: focus moves in on open, Tab is trapped inside,
 * Escape closes, and page scrolling is locked while open.
 */
export function MobileNavigation({ open, id, onClose }: MobileNavigationProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesId = useId();

  useEffect(() => {
    if (!open) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const linkBase =
    "flex w-full items-center justify-between rounded-xl px-4 py-3 font-display text-[1.35rem] transition-colors";
  const linkState = (active: boolean) =>
    active
      ? "bg-gold-pale font-semibold text-burgundy"
      : "text-ink hover:bg-gold-pale/70 hover:text-burgundy";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
          />
          <motion.div
            ref={panelRef}
            id={id}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 right-0 flex w-[min(88vw,380px)] flex-col overflow-y-auto bg-ivory shadow-card"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-gold/25 px-5 py-3">
              <Logo className="size-14" sizesHint="56px" onNavigate={onClose} />
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-gold-pale hover:text-burgundy"
              >
                <X aria-hidden="true" className="size-6" strokeWidth={1.6} />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 px-3 py-4">
              <ul className="space-y-1">
                {navigation.map((item) =>
                  item.kind === "categories" ? (
                    <li key={item.label}>
                      <button
                        type="button"
                        aria-expanded={categoriesOpen}
                        aria-controls={categoriesId}
                        onClick={() => setCategoriesOpen((v) => !v)}
                        className={`${linkBase} ${linkState(pathname.startsWith(categoriesBasePath))}`}
                      >
                        {item.label}
                        <ChevronDown
                          aria-hidden="true"
                          className={`size-5 text-gold-deep transition-transform duration-300 ${categoriesOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {categoriesOpen && (
                          <motion.ul
                            id={categoriesId}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className="grid gap-0.5 overflow-hidden px-2"
                          >
                            {categories.map((category) => (
                              <li key={category.slug}>
                                <Link
                                  href={categoryHref(category.slug)}
                                  onClick={onClose}
                                  className="flex items-center gap-2 rounded-lg px-3 py-2 font-display text-[1.05rem] text-ink transition-colors hover:bg-gold-pale hover:text-burgundy"
                                >
                                  <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-gold" />
                                  {category.name}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  ) : (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                        className={`${linkBase} ${linkState(isActivePath(pathname, item.href))}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
                <li>
                  <Link
                    href={routes.account}
                    onClick={onClose}
                    className={`${linkBase} ${linkState(false)} justify-start gap-3`}
                  >
                    <User aria-hidden="true" className="size-5 text-gold-deep" strokeWidth={1.6} />
                    My Account
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="border-t border-gold/25 bg-cream/70 px-5 pb-6 pt-5">
              <Link
                href={routes.shop}
                onClick={onClose}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-burgundy font-display text-lg font-semibold text-ivory shadow-soft transition-colors hover:bg-maroon-light"
              >
                <ShoppingBag aria-hidden="true" className="size-5" strokeWidth={1.6} />
                Shop Now
              </Link>
              <GoldFlourish className="mx-auto my-4 h-3 w-16 text-gold" />
              <ul className="space-y-2 text-center font-display text-[0.98rem] text-umber">
                <li className="flex items-center justify-center gap-2">
                  <Truck aria-hidden="true" className="size-4 text-gold-deep" strokeWidth={1.6} />
                  Pan India Delivery
                </li>
                <li className="flex items-center justify-center gap-2">
                  <MapPin aria-hidden="true" className="size-4 text-gold-deep" strokeWidth={1.6} />
                  {brand.location}
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
