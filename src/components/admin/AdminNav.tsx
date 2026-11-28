"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { activeNavItem, adminNav } from "./nav";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = activeNavItem(pathname);
  return (
    <ul className="space-y-0.5">
      {adminNav.map((item) => {
        const isActive = active?.href === item.href;
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-3 font-sans text-[0.9rem] font-semibold transition-colors ${
                isActive ? "bg-burgundy text-ivory shadow-soft" : "text-ink/80 hover:bg-gold-pale hover:text-burgundy"
              }`}
            >
              <Icon aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={1.8} />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Desktop sidebar navigation. */
export function AdminSidebarNav() {
  return (
    <nav aria-label="Admin">
      <NavList />
    </nav>
  );
}

/** Mobile/tablet: menu button + slide-in drawer (native dialog: focus trap, Escape). */
export function AdminMobileNav() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label="Open admin menu"
        className="grid size-11 place-items-center rounded-xl border border-gold/40 text-burgundy"
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>
      <dialog
        ref={dialogRef}
        aria-label="Admin menu"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="m-0 h-dvh max-h-dvh w-[min(85vw,300px)] max-w-none bg-ivory p-0 shadow-card backdrop:bg-ink/45"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gold/30 px-4 py-3">
            <p className="font-display text-[1.3rem] font-bold text-burgundy">S.G.S Admin</p>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close admin menu" className="grid size-11 place-items-center rounded-full hover:bg-gold-pale">
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <nav aria-label="Admin" className="flex-1 overflow-y-auto p-3">
            <NavList onNavigate={() => dialogRef.current?.close()} />
          </nav>
        </div>
      </dialog>
    </>
  );
}
