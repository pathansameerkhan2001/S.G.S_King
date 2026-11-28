import type { LucideIcon } from "lucide-react";
import { Boxes, Gift, Home, Image as ImageIcon, LayoutDashboard, LayoutGrid, MessageSquareQuote, Settings, ShoppingBag, TicketPercent } from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Placeholder for the context-aware top-bar search; omitted = no search on this page. */
  search?: string;
};

export const adminNav: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, search: "Search orders by ID, name or phone…" },
  { href: "/admin/products", label: "Products", icon: Boxes, search: "Search products…" },
  { href: "/admin/categories", label: "Categories", icon: LayoutGrid, search: "Search categories…" },
  { href: "/admin/combos", label: "Combos", icon: Gift, search: "Search combos…" },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon, search: "Search media by file name…" },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquareQuote, search: "Search reviews…" },
  { href: "/admin/coupons", label: "Coupons", icon: TicketPercent, search: "Search coupon codes…" },
  { href: "/admin/settings", label: "Store Settings", icon: Settings },
];

export const activeNavItem = (pathname: string) =>
  [...adminNav].sort((a, b) => b.href.length - a.href.length).find((i) => (i.href === "/admin" ? pathname === "/admin" : pathname === i.href || pathname.startsWith(`${i.href}/`)));
