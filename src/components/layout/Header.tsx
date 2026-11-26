"use client";

import { Menu, Search, ShoppingBag, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { routes } from "@/content/site";
import { useDismiss, type DismissReason } from "@/hooks/useDismiss";

import { CartPreview } from "./CartPreview";
import { DesktopNavigation } from "./DesktopNavigation";
import { Logo } from "./Logo";
import { MobileNavigation } from "./MobileNavigation";
import { SearchPanel } from "./SearchPanel";

const iconButton =
  "relative grid size-11 place-items-center rounded-full text-ink transition-colors duration-200 hover:bg-gold-pale hover:text-burgundy aria-expanded:bg-gold-pale aria-expanded:text-burgundy";

type HeaderProps = {
  /** Number of items in the cart. Wire this to the cart store when it exists. */
  cartCount?: number;
};

/**
 * Main site header. Sticky; the large logo overlaps the hero at the top of
 * the page and shrinks into the bar once the visitor scrolls.
 */
export function Header({ cartCount = 0 }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const searchId = useId();
  const cartId = useId();
  const menuId = useId();

  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const cartWrapperRef = useRef<HTMLDivElement>(null);
  const cartPanelRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeSearch = useCallback((reason: DismissReason = "escape") => {
    setSearchOpen(false);
    // Return focus to the trigger, except when the visitor clicked elsewhere.
    if (reason === "escape") searchButtonRef.current?.focus({ preventScroll: true });
  }, []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const dismissCart = useCallback(
    (reason: DismissReason) => {
      setCartOpen(false);
      if (reason === "escape") cartButtonRef.current?.focus({ preventScroll: true });
    },
    [],
  );
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus({ preventScroll: true });
  }, []);

  const searchRefs = useMemo(() => [searchPanelRef, searchButtonRef], []);
  const cartRefs = useMemo(() => [cartWrapperRef], []);
  useDismiss(searchOpen, searchRefs, closeSearch);
  useDismiss(cartOpen, cartRefs, dismissCart);

  const cartLabel = `Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`;

  return (
    <>
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-b border-gold/25 bg-ivory/95 shadow-[0_8px_30px_-18px_rgba(53,23,15,0.45)] backdrop-blur-md"
          : "border-b border-transparent bg-ivory"
      }`}
    >
      <div
        className={`relative mx-auto flex max-w-[1440px] items-center px-4 transition-[height] duration-300 sm:px-6 lg:px-10 xl:px-16 ${
          scrolled ? "h-[68px] lg:h-[88px]" : "h-[72px] lg:h-[108px] xl:h-[124px]"
        }`}
      >
        {/* Logo slot: the logo is absolutely positioned so it can hang over the hero */}
        <div className="relative h-full w-[58px] shrink-0 sm:w-[62px] lg:w-[136px] xl:w-[170px]">
          <div
            className={`absolute left-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              scrolled
                ? "top-1/2 size-[54px] -translate-y-1/2 lg:size-[76px]"
                : "top-1/2 size-[58px] -translate-y-1/2 sm:size-[62px] lg:top-2 lg:size-[136px] lg:translate-y-0 xl:size-[172px]"
            }`}
          >
            <Logo preload sizesHint="(min-width: 1280px) 172px, (min-width: 1024px) 136px, 62px" />
          </div>
        </div>

        <span aria-hidden="true" className="mx-5 hidden h-12 w-px shrink-0 bg-umber/30 lg:block xl:mx-10" />

        <div className="flex flex-1 justify-center">
          <DesktopNavigation />
        </div>

        <span aria-hidden="true" className="mx-4 hidden h-12 w-px shrink-0 bg-umber/30 lg:block xl:mx-8" />

        {/* Right-side controls */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 xl:gap-2.5">
          <button
            ref={searchButtonRef}
            type="button"
            className={iconButton}
            aria-label="Search"
            aria-expanded={searchOpen}
            aria-controls={searchId}
            onClick={() => {
              setCartOpen(false);
              setSearchOpen((v) => !v);
            }}
          >
            <Search aria-hidden="true" className="size-[22px] xl:size-6" strokeWidth={1.7} />
          </button>

          <Link href={routes.account} className={`${iconButton} hidden lg:grid`} aria-label="My account">
            <User aria-hidden="true" className="size-[22px] xl:size-6" strokeWidth={1.7} />
          </Link>

          <div ref={cartWrapperRef} className="relative">
            <button
              ref={cartButtonRef}
              type="button"
              className={iconButton}
              aria-label={cartLabel}
              aria-expanded={cartOpen}
              aria-controls={cartId}
              onClick={() => {
                setSearchOpen(false);
                setCartOpen((v) => !v);
              }}
            >
              <ShoppingCart aria-hidden="true" className="size-[22px] xl:size-6" strokeWidth={1.7} />
              <span
                aria-hidden="true"
                className="absolute right-0.5 top-0.5 grid min-w-5 place-items-center rounded-full bg-burgundy px-1 font-sans text-[0.68rem] font-bold leading-5 text-ivory ring-2 ring-ivory"
              >
                {cartCount}
              </span>
            </button>
            <CartPreview
              open={cartOpen}
              id={cartId}
              count={cartCount}
              onClose={closeCart}
              panelRef={cartPanelRef}
            />
          </div>

          <Link
            href={routes.shop}
            className="group ml-2 hidden h-12 whitespace-nowrap items-center gap-2.5 rounded-xl bg-burgundy px-5 font-display text-[1.12rem] font-semibold text-ivory shadow-soft transition-all duration-300 hover:-translate-y-px hover:bg-maroon-light hover:shadow-[0_14px_30px_-12px_rgba(101,10,22,0.5)] active:translate-y-0 lg:inline-flex xl:ml-4 xl:h-[52px] xl:px-7 xl:text-[1.2rem]"
          >
            <ShoppingBag
              aria-hidden="true"
              className="size-5 transition-transform duration-300 group-hover:-rotate-6"
              strokeWidth={1.7}
            />
            Shop Now
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            className={`${iconButton} lg:hidden`}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => {
              setSearchOpen(false);
              setCartOpen(false);
              setMenuOpen(true);
            }}
          >
            <Menu aria-hidden="true" className="size-6" strokeWidth={1.7} />
          </button>
        </div>
      </div>

      <SearchPanel
        open={searchOpen}
        id={searchId}
        onClose={() => closeSearch("escape")}
        panelRef={searchPanelRef}
      />
    </header>
    {/* Rendered outside <header>: its backdrop-filter would otherwise trap the fixed drawer */}
    <MobileNavigation open={menuOpen} id={menuId} onClose={closeMenu} />
    </>
  );
}
