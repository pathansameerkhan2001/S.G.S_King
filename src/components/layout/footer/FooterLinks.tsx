import {
  ChevronRight,
  Gift,
  House,
  Layers,
  Leaf,
  ShoppingBag,
  Star,
  Candy,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { categories } from "@/content/categories";
import { exploreLinks, footerCategoryHref, type FooterLinkIcon } from "@/content/footer";

import { FooterHeading } from "./FooterHeading";

const icons: Record<FooterLinkIcon, LucideIcon> = {
  home: House,
  shop: ShoppingBag,
  collections: Layers,
  star: Star,
  gift: Gift,
  sweets: Candy,
  story: Leaf,
};

const row =
  "group flex min-h-11 items-center gap-3 border-b border-gold/20 py-1.5 font-display text-[1.06rem] text-ink transition-colors duration-200 hover:text-burgundy xl:text-[1.12rem]";

const chevron = (
  <ChevronRight
    aria-hidden="true"
    className="ml-auto size-4 shrink-0 text-ink/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-burgundy"
  />
);

export function FooterExplore() {
  const links = exploreLinks.filter((link) => link.href);
  return (
    <nav aria-labelledby="footer-explore">
      <FooterHeading id="footer-explore">Explore</FooterHeading>
      {/* 2 columns on small phones keeps the footer short; 1 column from sm */}
      <ul className="grid grid-cols-2 gap-x-4 sm:grid-cols-1">
        {links.map((link) => {
          const Icon = icons[link.icon];
          return (
            <li key={link.label}>
              <Link href={link.href!} className={row}>
                <Icon aria-hidden="true" className="size-5 shrink-0 text-gold-deep" strokeWidth={1.5} />
                <span className="min-w-0">{link.label}</span>
                <span className="hidden sm:contents">{chevron}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function FooterCategories() {
  return (
    <nav aria-labelledby="footer-categories">
      <FooterHeading id="footer-categories">Shop by Category</FooterHeading>
      <ul>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link href={footerCategoryHref(category)} className={row}>
              <span className="relative size-8 shrink-0 overflow-hidden rounded-full border border-gold/45 bg-cream">
                <Image
                  src={category.image.src}
                  alt=""
                  fill
                  unoptimized={category.image.src.endsWith(".svg")}
                  sizes="32px"
                  className="scale-[1.6] object-cover object-[50%_62%]"
                />
              </span>
              <span className="min-w-0">{category.name}</span>
              {chevron}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
