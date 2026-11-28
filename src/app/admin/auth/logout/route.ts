import { NextResponse, type NextRequest } from "next/server";

import { isSameOrigin, SESSION_COOKIE, SESSION_COOKIE_DEV } from "@/lib/server/auth";
import { getAuthConfig } from "@/lib/server/env";

/**
 * Ends the admin session (POST only, same-origin). When
 * COGNITO_LOGOUT_REDIRECT_URI is configured (and registered as an allowed
 * sign-out URL in Cognito), the Cognito managed-login session ends too.
 */
export async function POST(request: NextRequest) {
  if (!(await isSameOrigin())) return new NextResponse("Forbidden", { status: 403 });

  let destination = new URL("/admin/login?signedOut=1", request.url).toString();
  try {
    const cfg = getAuthConfig();
    if (cfg.logoutRedirectUri) {
      const logout = new URL(`${cfg.domain}/logout`);
      logout.search = new URLSearchParams({ client_id: cfg.clientId, logout_uri: cfg.logoutRedirectUri }).toString();
      destination = logout.toString();
    }
  } catch {
    // Not configured: local sign-out only.
  }

  const response = NextResponse.redirect(destination, { status: 303 });
  // __Host- cookies can only be cleared with the same Secure/Path attributes.
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0, secure: true, httpOnly: true, sameSite: "lax" });
  response.cookies.set(SESSION_COOKIE_DEV, "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "lax" });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
