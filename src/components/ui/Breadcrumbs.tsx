import { ChevronRight } from "lucide-react";
import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1 font-sans text-[0.8rem] text-umber lg:pl-[190px] xl:pl-[200px]">
        {items.map((crumb, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="inline-flex min-h-8 items-center rounded px-0.5 underline-offset-4 transition-colors hover:text-burgundy hover:underline"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "font-semibold text-burgundy" : ""}>
                  {crumb.label}
                </span>
              )}
              {!last && <ChevronRight aria-hidden="true" className="size-3.5 text-gold-deep" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
