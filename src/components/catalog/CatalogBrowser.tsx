"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { categories } from "@/content/categories";
import {
  fromPrice,
  matchesQuery,
  sortItems,
  sortOptions,
  type CatalogItem,
  type CatalogKind,
  type SortKey,
} from "@/lib/catalog";

import { CatalogGrid } from "./CatalogGrid";

export const priceRanges = [
  { id: "under-300", label: "Under ₹300", min: 0, max: 299 },
  { id: "300-600", label: "₹300 – ₹600", min: 300, max: 600 },
  { id: "600-1000", label: "₹600 – ₹1,000", min: 601, max: 1000 },
  { id: "1000-plus", label: "Above ₹1,000", min: 1001, max: Infinity },
] as const;

export type BrowserState = {
  query: string;
  categories: string[];
  types: CatalogKind[];
  price: string | null;
  inStock: boolean;
  sort: SortKey;
};

export const emptyState: BrowserState = { query: "", categories: [], types: [], price: null, inStock: false, sort: "featured" };

type CatalogBrowserProps = {
  items: CatalogItem[];
  initial?: Partial<BrowserState>;
  /** Show category / type filters (shop and search). Category pages hide them. */
  showCategoryFilter?: boolean;
  showTypeFilter?: boolean;
  /** Hide the in-grid search box (the search page has its own). */
  showSearch?: boolean;
  searchPlaceholder?: string;
  /** Keep filters in the URL (?q=&category=&type=&price=&sort=) so results can be shared. */
  syncUrl?: boolean;
  pageSize?: number;
  /** Called when the visible result count changes (e.g. for headings). */
  emptyMessage?: string;
};

function applyFilters(items: CatalogItem[], s: BrowserState) {
  const range = priceRanges.find((r) => r.id === s.price);
  return sortItems(
    items.filter((item) => {
      if (s.query && !matchesQuery(item, s.query)) return false;
      if (s.categories.length && (!item.categorySlug || !s.categories.includes(item.categorySlug))) return false;
      if (s.types.length && !s.types.includes(item.kind)) return false;
      if (range) {
        const price = fromPrice(item);
        if (price < range.min || price > range.max) return false;
      }
      if (s.inStock && item.availability === "out_of_stock") return false;
      return true;
    }),
    s.sort,
  );
}

function writeUrl(s: BrowserState) {
  const params = new URLSearchParams(window.location.search);
  const set = (key: string, value: string | null) => (value ? params.set(key, value) : params.delete(key));
  set("q", s.query.trim() || null);
  set("category", s.categories.join(",") || null);
  set("type", s.types.join(",") || null);
  set("price", s.price);
  set("sort", s.sort === "featured" ? null : s.sort);
  set("stock", s.inStock ? "1" : null);
  const qs = params.toString();
  window.history.replaceState(window.history.state, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
}

export function CatalogBrowser({
  items,
  initial,
  showCategoryFilter = true,
  showTypeFilter = true,
  showSearch = true,
  searchPlaceholder = "Search products…",
  syncUrl = false,
  pageSize = 12,
  emptyMessage = "No products match your filters.",
}: CatalogBrowserProps) {
  const [state, setState] = useState<BrowserState>({ ...emptyState, ...initial });
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const drawerRef = useRef<HTMLDialogElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const searchId = useId();
  const sortId = useId();

  const results = useMemo(() => applyFilters(items, state), [items, state]);
  const shown = results.slice(0, visibleCount);

  useEffect(() => {
    if (syncUrl) writeUrl(state);
  }, [state, syncUrl]);

  const update = (patch: Partial<BrowserState>) => {
    setState((s) => ({ ...s, ...patch }));
    setVisibleCount(pageSize);
  };
  const toggle = <T extends string>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const activeChips = [
    ...(showSearch && state.query ? [{ label: `“${state.query}”`, clear: () => update({ query: "" }) }] : []),
    ...state.categories.map((slug) => ({
      label: categories.find((c) => c.slug === slug)?.name ?? slug,
      clear: () => update({ categories: state.categories.filter((c) => c !== slug) }),
    })),
    ...state.types.map((t) => ({ label: t === "combo" ? "Combos" : "Products", clear: () => update({ types: state.types.filter((x) => x !== t) }) })),
    ...(state.price ? [{ label: priceRanges.find((r) => r.id === state.price)?.label ?? "", clear: () => update({ price: null }) }] : []),
    ...(state.inStock ? [{ label: "In stock", clear: () => update({ inStock: false }) }] : []),
  ];
  const clearAll = () => update({ ...emptyState, query: showSearch ? "" : state.query, sort: state.sort });

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) if (item.categorySlug) map.set(item.categorySlug, (map.get(item.categorySlug) ?? 0) + 1);
    return map;
  }, [items]);

  const filters = (
    <div className="space-y-6">
      {showCategoryFilter && (
        <fieldset>
          <legend className="font-display text-[1.15rem] font-bold text-burgundy">Category</legend>
          <ul className="mt-2 space-y-0.5">
            {categories.map((c) => (
              <li key={c.slug}>
                <label className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg px-1.5 font-sans text-[0.88rem] text-ink hover:bg-gold-pale/60">
                  <input
                    type="checkbox"
                    checked={state.categories.includes(c.slug)}
                    onChange={() => update({ categories: toggle(state.categories, c.slug) })}
                    className="size-4 accent-[#650a16]"
                  />
                  <span className="flex-1">{c.name}</span>
                  <span className="text-xs text-umber/80">{counts.get(c.slug) ?? 0}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}
      {showTypeFilter && (
        <fieldset>
          <legend className="font-display text-[1.15rem] font-bold text-burgundy">Product type</legend>
          <ul className="mt-2 space-y-0.5">
            {(["product", "combo"] as const).map((t) => (
              <li key={t}>
                <label className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg px-1.5 font-sans text-[0.88rem] text-ink hover:bg-gold-pale/60">
                  <input
                    type="checkbox"
                    checked={state.types.includes(t)}
                    onChange={() => update({ types: toggle(state.types, t) })}
                    className="size-4 accent-[#650a16]"
                  />
                  {t === "product" ? "Individual products" : "Combo packs"}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}
      <fieldset>
        <legend className="font-display text-[1.15rem] font-bold text-burgundy">Price</legend>
        <ul className="mt-2 space-y-0.5">
          {[{ id: null, label: "Any price" }, ...priceRanges].map((r) => (
            <li key={r.id ?? "any"}>
              <label className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg px-1.5 font-sans text-[0.88rem] text-ink hover:bg-gold-pale/60">
                <input
                  type="radio"
                  name={`${searchId}-price`}
                  checked={state.price === r.id}
                  onChange={() => update({ price: r.id })}
                  className="size-4 accent-[#650a16]"
                />
                {r.label}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
      <label className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-lg px-1.5 font-sans text-[0.88rem] text-ink hover:bg-gold-pale/60">
        <input type="checkbox" checked={state.inStock} onChange={() => update({ inStock: !state.inStock })} className="size-4 accent-[#650a16]" />
        In stock only
      </label>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[250px_1fr] lg:gap-10">
      {/* Desktop sidebar */}
      <aside aria-label="Filters" className="hidden lg:block">
        <div className="sticky top-28 rounded-2xl border border-gold/30 bg-ivory/80 p-5 shadow-[0_10px_30px_-24px_rgba(53,23,15,0.5)]">
          {filters}
          {activeChips.length > 0 && (
            <button type="button" onClick={clearAll} className="mt-5 min-h-10 font-sans text-sm font-semibold text-burgundy underline underline-offset-4">
              Clear all filters
            </button>
          )}
        </div>
      </aside>

      <div className="min-w-0">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {showSearch && (
            <div className="relative min-w-0 flex-[1_1_220px]">
              <label htmlFor={searchId} className="sr-only">
                Search
              </label>
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-umber" />
              <input
                id={searchId}
                type="search"
                value={state.query}
                onChange={(e) => update({ query: e.target.value })}
                placeholder={searchPlaceholder}
                className="h-11 w-full rounded-xl border border-gold/45 bg-ivory pl-10 pr-3 font-sans text-[0.92rem] text-ink placeholder:text-umber/70 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>
          )}
          <button
            ref={filterButtonRef}
            type="button"
            onClick={() => drawerRef.current?.showModal()}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-gold/45 bg-ivory px-4 font-sans text-[0.88rem] font-semibold text-ink lg:hidden"
          >
            <SlidersHorizontal aria-hidden="true" className="size-4" />
            Filters
            {activeChips.length > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-burgundy px-1 text-[0.68rem] text-ivory">{activeChips.length}</span>
            )}
          </button>
          <div className="ml-auto flex items-center gap-2">
            <label htmlFor={sortId} className="hidden font-sans text-[0.82rem] text-umber sm:block">
              Sort by
            </label>
            <select
              id={sortId}
              value={state.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              aria-label="Sort products"
              className="h-11 rounded-xl border border-gold/45 bg-ivory px-3 font-sans text-[0.88rem] text-ink focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-gold/40"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count + active filters */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p role="status" aria-live="polite" className="mr-1 font-sans text-[0.85rem] text-umber">
            {results.length} {results.length === 1 ? "item" : "items"}
          </p>
          {activeChips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={chip.clear}
              className="inline-flex min-h-8 items-center gap-1 rounded-full border border-gold/50 bg-gold-pale/60 px-3 font-sans text-xs font-semibold text-ink hover:border-burgundy"
            >
              {chip.label}
              <X aria-hidden="true" className="size-3.5" />
              <span className="sr-only">Remove filter</span>
            </button>
          ))}
          {activeChips.length > 1 && (
            <button type="button" onClick={clearAll} className="min-h-8 font-sans text-xs font-semibold text-burgundy underline underline-offset-4">
              Clear all
            </button>
          )}
        </div>

        <div className="mt-5">
          {results.length > 0 ? (
            <>
              <CatalogGrid items={shown} columns={3} label="Products" />
              {visibleCount < results.length && (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((n) => n + pageSize)}
                    className="h-12 rounded-xl border-[1.5px] border-burgundy bg-ivory px-8 font-display text-[1.1rem] font-semibold text-burgundy transition-colors hover:bg-burgundy hover:text-ivory"
                  >
                    Load more ({results.length - visibleCount} more)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-gold/50 bg-ivory/70 px-6 py-12 text-center">
              <p className="font-display text-[1.4rem] font-semibold text-burgundy">{emptyMessage}</p>
              <p className="mt-2 font-sans text-sm text-umber">Try a different search, or clear your filters.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {activeChips.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="h-11 rounded-xl bg-burgundy px-6 font-display text-[1.05rem] font-semibold text-ivory hover:bg-maroon-light"
                  >
                    Clear all filters
                  </button>
                )}
                <Link
                  href="/shop"
                  className="inline-flex h-11 items-center rounded-xl border-[1.5px] border-burgundy px-6 font-display text-[1.05rem] font-semibold text-burgundy hover:bg-gold-pale"
                >
                  Browse all products
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer (native dialog: focus trap + Escape) */}
      <dialog
        ref={drawerRef}
        aria-label="Filters"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        onClose={() => filterButtonRef.current?.focus()}
        className="m-0 ml-auto h-dvh max-h-dvh w-[min(88vw,360px)] max-w-none bg-ivory p-0 text-ink shadow-card backdrop:bg-ink/45 open:animate-[combo-dialog-in_0.25s_ease-out] lg:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gold/30 px-5 py-3">
            <p className="font-display text-[1.4rem] font-bold text-burgundy">Filters</p>
            <button
              type="button"
              onClick={() => drawerRef.current?.close()}
              aria-label="Close filters"
              className="grid size-11 place-items-center rounded-full hover:bg-gold-pale"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">{filters}</div>
          <div className="grid grid-cols-2 gap-3 border-t border-gold/30 p-4">
            <button type="button" onClick={clearAll} className="h-12 rounded-xl border-[1.5px] border-burgundy font-display font-semibold text-burgundy">
              Clear all
            </button>
            <button
              type="button"
              onClick={() => drawerRef.current?.close()}
              className="h-12 rounded-xl bg-burgundy font-display font-semibold text-ivory"
            >
              Show {results.length}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
