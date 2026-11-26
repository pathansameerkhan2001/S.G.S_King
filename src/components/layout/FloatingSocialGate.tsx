"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Shopping routes where, on phones, the floating bar would cover product controls. */
const SHOPPING_PREFIXES = ["/shop", "/categories", "/products", "/combos", "/search", "/cart", "/checkout", "/wishlist", "/order-success", "/account"];

/**
 * Hides the floating social bar below 1024px on shopping pages,
 * so it never blocks Add to Cart / wishlist / share controls. Tablets and
 * other pages and desktops always show it.
 */
export function FloatingSocialGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shopping = SHOPPING_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  return <div className={shopping ? "max-lg:hidden" : undefined}>{children}</div>;
}
