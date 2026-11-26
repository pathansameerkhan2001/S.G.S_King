import { NextResponse, type NextRequest } from "next/server";

import { categories } from "@/content/categories";
import { policies } from "@/content/policies";
import { catalogCombos, catalogProducts } from "@/lib/catalog";

/**
 * Returns a real 404 status for unknown slugs on dynamic routes.
 * (These routes stream, so notFound() inside the page would render the
 * custom 404 UI with a 200 status; checking here happens before rendering.)
 */
const known: Record<string, Set<string>> = {
  products: new Set(catalogProducts.map((p) => p.slug)),
  combos: new Set(catalogCombos.map((c) => c.slug)),
  categories: new Set(categories.map((c) => c.slug)),
  policies: new Set(policies.map((p) => p.slug)),
};

export function proxy(request: NextRequest) {
  const [, section, slug, ...rest] = request.nextUrl.pathname.split("/");
  const slugs = known[section];
  if (slugs && slug && (rest.length > 0 || !slugs.has(slug))) {
    // Rewrite to an unmatched path: Next renders app/not-found.tsx with status 404.
    return NextResponse.rewrite(new URL("/__not-found", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path+", "/combos/:path+", "/categories/:path+", "/policies/:path+"],
};
