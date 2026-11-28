import { NextResponse, type NextRequest } from "next/server";

import {
  cookieSecure,
  idTokenVerifier,
  OAUTH_COOKIE,
  OAUTH_PURPOSE,
  SESSION_PURPOSE,
  sessionCookieName,
  type AdminSession,
} from "@/lib/server/auth";
import { ConfigError, getAuthConfig } from "@/lib/server/env";
import { safeEqual, seal, unseal } from "@/lib/server/seal";

import type { OAuthState } from "../login/route";

/** Cognito redirects here with ?code&state after managed login. */
export async function GET(request: NextRequest) {
  const fail = (reason: string) => {
    const res = NextResponse.redirect(new URL(`/admin/login?error=${reason}`, request.url));
    res.cookies.delete({ name: OAUTH_COOKIE, path: "/admin/auth" });
    res.headers.set("Cache-Control", "no-store");
    return res;
  };

  let cfg;
  try {
    cfg = getAuthConfig();
  } catch (e) {
    if (e instanceof ConfigError) return fail("config");
    throw e;
  }

  const params = request.nextUrl.searchParams;
  if (params.get("error")) return fail("denied");
  const code = params.get("code");
  const state = params.get("state");
  const oauth = unseal<OAuthState>(request.cookies.get(OAUTH_COOKIE)?.value, cfg.sessionSecret, OAUTH_PURPOSE);
  if (!code || !state || !oauth || !safeEqual(state, oauth.state)) return fail("state");

  // Exchange the authorization code (server-to-server; tokens never reach the browser).
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: cfg.clientId,
    code,
    redirect_uri: `${cfg.baseUrl}/admin/auth/callback`,
    code_verifier: oauth.verifier,
  });
  const tokenHeaders: Record<string, string> = { "Content-Type": "application/x-www-form-urlencoded" };
  if (cfg.clientSecret) {
    tokenHeaders.Authorization = `Basic ${Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString("base64")}`;
  }

  let idToken: string | undefined;
  try {
    const res = await fetch(`${cfg.domain}/oauth2/token`, { method: "POST", headers: tokenHeaders, body, cache: "no-store" });
    if (!res.ok) return fail("exchange");
    idToken = ((await res.json()) as { id_token?: string }).id_token;
  } catch {
    return fail("exchange");
  }
  if (!idToken) return fail("exchange");

  // Verify signature, issuer, audience, expiry, token_use; then nonce and group.
  let claims;
  try {
    claims = await idTokenVerifier(cfg).verify(idToken);
  } catch {
    return fail("token");
  }
  if (typeof claims.nonce !== "string" || !safeEqual(claims.nonce, oauth.nonce)) return fail("token");
  const groups = Array.isArray(claims["cognito:groups"]) ? (claims["cognito:groups"] as string[]) : [];
  if (!groups.includes(cfg.adminGroup)) return fail("forbidden");

  const session: AdminSession = {
    sub: claims.sub,
    email: typeof claims.email === "string" ? claims.email : undefined,
    name: typeof claims.name === "string" ? claims.name : undefined,
    groups,
    exp: claims.exp,
  };
  const ttl = Math.max(60, claims.exp - Math.floor(Date.now() / 1000));

  const response = NextResponse.redirect(new URL(oauth.next, cfg.baseUrl));
  response.cookies.delete({ name: OAUTH_COOKIE, path: "/admin/auth" });
  response.cookies.set(sessionCookieName(cfg), seal(session, cfg.sessionSecret, SESSION_PURPOSE, ttl), {
    httpOnly: true,
    secure: cookieSecure(cfg),
    sameSite: "lax",
    path: "/",
    maxAge: ttl,
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
