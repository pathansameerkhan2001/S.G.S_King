"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { activeNavItem } from "./nav";

/**
 * Context-aware search (same look as the storefront search box): searches
 * the module you are on by setting ?q= on its list page. Hidden on pages
 * without a searchable list. Never searches across modules, so customer
 * details only appear on the Orders page.
 */
export function AdminSearch() {
  const pathname = usePathname();
  // Remount per page so each module starts with its own query.
  return <SearchBox key={pathname} pathname={pathname} />;
}

function SearchBox({ pathname }: { pathname: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const item = activeNavItem(pathname);
  const [value, setValue] = useState(params.get("q") ?? "");
  if (!item?.search) return <div className="flex-1" />;

  const submit = (q: string) => {
    const next = new URLSearchParams(item.href === pathname ? params.toString() : "");
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    router.push(`${item.href}${next.toString() ? `?${next}` : ""}`);
  };

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit(value);
      }}
      className="relative min-w-0 flex-1 sm:max-w-md"
    >
      <label htmlFor="admin-search" className="sr-only">
        {item.search}
      </label>
      <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-umber" />
      <input
        id="admin-search"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={item.search}
        autoComplete="off"
        className="h-11 w-full rounded-xl border border-gold/45 bg-ivory pl-10 pr-10 font-sans text-[0.9rem] text-ink placeholder:text-umber/70 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-gold/40"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            submit("");
          }}
          aria-label="Clear search"
          className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-umber hover:text-burgundy"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      )}
    </form>
  );
}
