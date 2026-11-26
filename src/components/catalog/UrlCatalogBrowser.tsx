"use client";

import { useSearchParams } from "next/navigation";

import { categories } from "@/content/categories";
import { sortOptions, type CatalogItem, type CatalogKind, type SortKey } from "@/lib/catalog";

import { CatalogBrowser, priceRanges, type BrowserState } from "./CatalogBrowser";

const list = (value: string | null) => (value ? value.split(",").filter(Boolean) : []);

/** Reads filters from the URL (?q, category, type, price, sort, stock). */
export function stateFromParams(params: URLSearchParams): Partial<BrowserState> {
  const sortParam = params.get("sort");
  const sort: SortKey = sortParam === "bestsellers" ? "featured" : sortOptions.some((o) => o.value === sortParam) ? (sortParam as SortKey) : "featured";
  return {
    query: params.get("q") ?? "",
    categories: list(params.get("category")).filter((slug) => categories.some((c) => c.slug === slug)),
    types: list(params.get("type")).filter((t): t is CatalogKind => t === "product" || t === "combo"),
    price: priceRanges.some((r) => r.id === params.get("price")) ? params.get("price") : null,
    inStock: params.get("stock") === "1",
    sort,
  };
}

/** Catalogue browser whose filters live in (and are restored from) the URL. */
export function UrlCatalogBrowser({ items }: { items: CatalogItem[] }) {
  const params = useSearchParams();
  return <CatalogBrowser items={items} initial={stateFromParams(new URLSearchParams(params.toString()))} syncUrl searchPlaceholder="Search all products and combos…" />;
}
