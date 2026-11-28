import { NextResponse, type NextRequest } from "next/server";

import { categories } from "@/content/categories";
import { policies } from "@/content/policies";
import { catalogCombos, catalogProducts } from "@/lib/catalog";
import { sessionCookieName, validateSessionValue } from "@/lib/server/auth";
import { ConfigError, getAuthConfig } from "@/lib/server/env";

/**
 * 1) Admin gate: every /admin and /api/admin request (except login/auth)
 *    must carry a valid, unexpired ADMIN session. Pages and APIs re-check
 *    server-side (defence in depth); this stops unauthenticated requests early.
 * 2) Storefront: real 404 status for unknown slugs on dynamic routes.
 */
const known: Record<string, Set<string>> = {
  products: new Set(catalogProducts.map((p) => p.slug)),
  combos: new Set(catalogCombos.map((c) => c.slug)),
  categories: new Set(categories.map((c) => c.slug)),
  policies: new Set(policies.map((p) => p.slug)),
};

const PUBLIC_ADMIN = ["/admin/login", "/admin/auth/"];

function adminHeaders(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "same-origin");
  return response;
}

function adminGate(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/admin");
  if (!isApi && PUBLIC_ADMIN.some((p) => pathname === p || pathname.startsWith(p))) return adminHeaders(NextResponse.next());

  let valid = false;
  try {
    const cfg = getAuthConfig();
    valid = !!validateSessionValue(request.cookies.get(sessionCookieName(cfg))?.value, cfg);
  } catch (e) {
    if (!(e instanceof ConfigError)) throw e;
  }
  if (valid) return adminHeaders(NextResponse.next());

  if (isApi) return adminHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  const login = new URL("/admin/login", request.url);
  login.searchParams.set("next", pathname + request.nextUrl.search);
  return adminHeaders(NextResponse.redirect(login));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin")) return adminGate(request);

  const [, section, slug, ...rest] = pathname.split("/");
  const slugs = known[section];
  if (slugs && slug && (rest.length > 0 || !slugs.has(slug))) {
    // Rewrite to an unmatched path: Next renders app/not-found.tsx with status 404.
    return NextResponse.rewrite(new URL("/__not-found", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/products/:path+",
    "/combos/:path+",
    "/categories/:path+",
    "/policies/:path+",
  ],
};
