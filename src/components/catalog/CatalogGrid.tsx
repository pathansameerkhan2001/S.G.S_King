import type { CatalogItem } from "@/lib/catalog";

import { CatalogProductCard } from "./CatalogProductCard";

type CatalogGridProps = {
  items: CatalogItem[];
  /** Columns at large widths: 3 when beside a filter sidebar, 4 full width. */
  columns?: 3 | 4;
  label?: string;
};

export function CatalogGrid({ items, columns = 4, label }: CatalogGridProps) {
  return (
    <ul
      aria-label={label}
      className={`grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-5 ${
        columns === 4 ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-3"
      } xl:gap-6`}
    >
      {items.map((item) => (
        <li key={item.key} className="min-w-0">
          <CatalogProductCard item={item} />
        </li>
      ))}
    </ul>
  );
}
