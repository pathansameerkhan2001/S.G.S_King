"use client";

import { Clock, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { categories, categoryHref } from "@/content/categories";
import { catalog, matchesQuery, searchCategories } from "@/lib/catalog";
import { clearRecentSearches, recordSearch, useRecentSearches } from "@/lib/history";

import { CatalogBrowser } from "./CatalogBrowser";

const SUGGESTIONS = ["Laddu", "Chikki", "Honey", "Masala", "Millet", "Combo"];

/** Search box; remounted (via key) whenever the URL query changes. */
function SearchForm({ initialQuery, onSearch }: { initialQuery: string; onSearch: (q: string) => void }) {
  const [draft, setDraft] = useState(initialQuery);
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(draft);
      }}
      className="mx-auto flex max-w-2xl gap-2"
    >
      <label htmlFor="search-page-input" className="sr-only">
        Search products, combos and categories
      </label>
      <div className="relative flex-1">
        <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-umber" />
        <input
          id="search-page-input"
          type="search"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Search laddus, honey, chikkis…"
          autoComplete="off"
          className="h-12 w-full rounded-xl border border-gold/45 bg-ivory pl-12 pr-10 font-sans text-[0.95rem] text-ink focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
        {draft && (
          <button
            type="button"
            onClick={() => {
              setDraft("");
              onSearch("");
            }}
            aria-label="Clear search"
            className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-umber hover:text-burgundy"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
      <button type="submit" className="h-12 rounded-xl bg-burgundy px-5 font-display text-[1.08rem] font-semibold text-ivory hover:bg-maroon-light sm:px-7">
        Search
      </button>
    </form>
  );
}

/** Search page body. The query lives in ?q= so results can be shared and refreshed. */
export function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const query = params.get("q")?.trim() ?? "";
  const recent = useRecentSearches();
  useEffect(() => {
    if (query) recordSearch(query);
  }, [query]);

  const matches = useMemo(() => (query ? catalog.filter((i) => matchesQuery(i, query)) : []), [query]);
  const categoryMatches = useMemo(() => searchCategories(query), [query]);
  const productCount = matches.filter((m) => m.kind === "product").length;
  const comboCount = matches.length - productCount;

  const go = (q: string) => router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");

  return (
    <div>
      <SearchForm key={query} initialQuery={query} onSearch={go} />

      {/* Suggestions & recent searches */}
      <div className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center gap-2 font-sans text-xs text-umber">
        {recent.length > 0 ? (
          <>
            <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-[0.14em]">
              <Clock aria-hidden="true" className="size-3.5" />
              Recent:
            </span>
            {recent.map((r) => (
              <Link key={r} href={`/search?q=${encodeURIComponent(r)}`} className="inline-flex min-h-8 items-center rounded-full border border-gold/40 px-3 text-ink hover:border-burgundy hover:text-burgundy">
                {r}
              </Link>
            ))}
            <button type="button" onClick={clearRecentSearches} className="min-h-8 px-1 font-semibold text-burgundy underline underline-offset-2">
              Clear
            </button>
          </>
        ) : (
          <>
            <span className="font-semibold uppercase tracking-[0.14em]">Try:</span>
            {SUGGESTIONS.map((s) => (
              <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="inline-flex min-h-8 items-center rounded-full border border-gold/40 px-3 text-ink hover:border-burgundy hover:text-burgundy">
                {s}
              </Link>
            ))}
          </>
        )}
      </div>

      {query ? (
        <div className="mt-8">
          <h2 className="font-display text-[1.6rem] font-bold text-burgundy sm:text-[1.9rem]">
            {matches.length + categoryMatches.length > 0 ? (
              <>
                Results for &ldquo;{query}&rdquo;
              </>
            ) : (
              <>No results for &ldquo;{query}&rdquo;</>
            )}
          </h2>
          <p className="mt-1 font-sans text-sm text-umber">
            {productCount} {productCount === 1 ? "product" : "products"} · {comboCount} {comboCount === 1 ? "combo" : "combos"} ·{" "}
            {categoryMatches.length} {categoryMatches.length === 1 ? "category" : "categories"}
          </p>

          {categoryMatches.length > 0 && (
            <ul aria-label="Matching categories" className="mt-4 flex flex-wrap gap-2">
              {categoryMatches.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={categoryHref(c.slug)}
                    className="inline-flex min-h-10 items-center rounded-full bg-burgundy px-4 font-display text-[1rem] font-semibold text-ivory hover:bg-maroon-light"
                  >
                    {c.name} →
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {matches.length > 0 ? (
            <div className="mt-6">
              <CatalogBrowser key={query} items={matches} showSearch={false} emptyMessage="No results match these filters." />
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-gold/50 bg-ivory/70 px-6 py-10 text-center">
              <p className="font-display text-[1.3rem] text-burgundy">We couldn&rsquo;t find a product matching your search.</p>
              <p className="mt-2 font-sans text-sm text-umber">Check the spelling, try a shorter word, or browse a category:</p>
              <ul className="mt-4 flex flex-wrap justify-center gap-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={categoryHref(c.slug)} className="inline-flex min-h-10 items-center rounded-full border border-gold/50 bg-ivory px-4 font-sans text-sm font-semibold text-ink hover:border-burgundy hover:text-burgundy">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-10">
          <h2 className="text-center font-display text-[1.6rem] font-bold text-burgundy">Browse by category</h2>
          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={categoryHref(c.slug)} className="inline-flex min-h-11 items-center rounded-full border border-gold/50 bg-ivory px-5 font-display text-[1.05rem] font-semibold text-ink hover:border-burgundy hover:text-burgundy">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
