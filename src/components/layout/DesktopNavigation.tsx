"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigation } from "@/content/site";
import { isActivePath as isActive } from "@/lib/nav";

import { CategoryDropdown } from "./CategoryDropdown";

/**
 * Shared link style. The active link gets a burgundy underline bar; others
 * reveal a gold bar on hover/focus.
 */
const linkClassName =
  "relative whitespace-nowrap py-2 font-display text-[1.08rem] xl:text-[1.22rem] font-medium text-ink transition-colors duration-200 hover:text-burgundy " +
  "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2.5px] after:origin-center after:scale-x-0 after:rounded-full after:bg-gold after:transition-transform after:duration-300 " +
  "hover:after:scale-x-100 focus-visible:after:scale-x-100 " +
  "data-[active]:font-semibold data-[active]:text-burgundy data-[active]:after:scale-x-100 data-[active]:after:bg-burgundy";

export function DesktopNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-5 xl:gap-11">
        {navigation.map((item) => (
          <li key={item.label}>
            {item.kind === "categories" ? (
              <CategoryDropdown
                label={item.label}
                active={pathname.startsWith("/categories")}
                linkClassName={linkClassName}
              />
            ) : (
              <Link
                href={item.href}
                className={linkClassName}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                data-active={isActive(pathname, item.href) || undefined}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
