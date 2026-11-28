import { NextResponse, type NextRequest } from "next/server";

import { cookieSecure, OAUTH_COOKIE, OAUTH_PURPOSE, safeAdminPath } from "@/lib/server/auth";
import { ConfigError, getAuthConfig } from "@/lib/server/env";
import { pkceChallenge, randomToken, seal } from "@/lib/server/seal";

export type OAuthState = { state: string; nonce: string; verifier: string; next: string };

/** Starts Cognito managed login (Authorization Code + PKCE). */
export async function GET(request: NextRequest) {
  let cfg;
  try {
    cfg = getAuthConfig();
  } catch (e) {
    if (e instanceof ConfigError) return NextResponse.redirect(new URL("/admin/login?error=config", request.url));
    throw e;
  }

  const oauth: OAuthState = {
    state: randomToken(),
    nonce: randomToken(),
    verifier: randomToken(48),
    next: safeAdminPath(request.nextUrl.searchParams.get("next")),
  };

  const authorize = new URL(`${cfg.domain}/oauth2/authorize`);
  authorize.search = new URLSearchParams({
    response_type: "code",
    client_id: cfg.clientId,
    redirect_uri: `${cfg.baseUrl}/admin/auth/callback`,
    scope: "openid email",
    state: oauth.state,
    nonce: oauth.nonce,
    code_challenge: pkceChallenge(oauth.verifier),
    code_challenge_method: "S256",
  }).toString();

  const response = NextResponse.redirect(authorize);
  response.cookies.set(OAUTH_COOKIE, seal(oauth, cfg.sessionSecret, OAUTH_PURPOSE, 600), {
    httpOnly: true,
    secure: cookieSecure(cfg),
    sameSite: "lax",
    path: "/admin/auth",
    maxAge: 600,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
