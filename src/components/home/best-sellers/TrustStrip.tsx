import { Gem, PackageCheck, Truck, UtensilsCrossed, type LucideIcon } from "lucide-react";

import { trustHighlights, type TrustHighlight } from "@/content/bestSellers";

const icons: Record<TrustHighlight["icon"], LucideIcon> = {
  taste: UtensilsCrossed,
  quality: Gem,
  packed: PackageCheck,
  delivery: Truck,
};

/** Compact 4-up benefits strip: 2×2 on mobile, one row from `lg`. */
export function TrustStrip() {
  return (
    <ul
      aria-label="Why shop with S.G.S King"
      className="grid grid-cols-2 overflow-hidden rounded-2xl border border-gold/35 bg-ivory/80 shadow-[0_10px_30px_-24px_rgba(53,23,15,0.5)] lg:grid-cols-4"
    >
      {trustHighlights.map((item, i) => {
        const Icon = icons[item.icon];
        return (
          <li
            key={item.title}
            className={[
              "flex items-center gap-2.5 px-3 py-3 sm:gap-3.5 sm:px-5 sm:py-4 lg:justify-center lg:py-5",
              // dividers: vertical between columns, horizontal between mobile rows
              i % 2 === 1 ? "border-l border-gold/25" : "",
              i >= 2 ? "border-t border-gold/25 lg:border-t-0" : "",
              i === 2 ? "lg:border-l" : "",
            ].join(" ")}
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-gold/50 bg-gold-pale text-gold-deep sm:size-11">
              <Icon aria-hidden="true" className="size-4 sm:size-5" strokeWidth={1.6} />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-[0.95rem] font-semibold leading-tight text-burgundy sm:text-[1.08rem]">
                {item.title}
              </span>
              <span className="block font-sans text-[0.68rem] leading-snug text-umber sm:text-xs">
                {item.detail}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
