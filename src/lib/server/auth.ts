import "server-only";

import { CognitoJwtVerifier } from "aws-jwt-verify";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { ConfigError, getAuthConfig, type AuthConfig } from "./env";
import { safeEqual, unseal } from "./seal";

export const SESSION_COOKIE = "__Host-sgs_admin";
export const SESSION_COOKIE_DEV = "sgs_admin";
export const OAUTH_COOKIE = "sgs_admin_oauth";
export const SESSION_PURPOSE = "admin-session";
export const OAUTH_PURPOSE = "admin-oauth";

/** What the encrypted session cookie holds: verified identity only, no tokens. */
export type AdminSession = {
  sub: string;
  email?: string;
  name?: string;
  groups: string[];
  /** ID token expiry (epoch seconds); the session never outlives it. */
  exp: number;
};

const isSecureOrigin = (cfg: AuthConfig) => cfg.baseUrl.startsWith("https://");
/** `__Host-` cookies require HTTPS; plain localhost development uses a normal name. */
export const sessionCookieName = (cfg: AuthConfig) => (isSecureOrigin(cfg) ? SESSION_COOKIE : SESSION_COOKIE_DEV);
export const cookieSecure = isSecureOrigin;

const createVerifier = (cfg: AuthConfig) =>
  CognitoJwtVerifier.create({ userPoolId: cfg.userPoolId, tokenUse: "id", clientId: cfg.clientId });

let verifier: ReturnType<typeof createVerifier> | null = null;
let verifierKey = "";

/** Verifies an ID token's signature (JWKS), issuer, audience, expiry and token_use. */
export function idTokenVerifier(cfg: AuthConfig) {
  const key = `${cfg.userPoolId}|${cfg.clientId}`;
  if (!verifier || verifierKey !== key) {
    verifier = createVerifier(cfg);
    verifierKey = key;
  }
  return verifier;
}

/** Validates a raw session cookie value (used by the proxy and by getAdminSession). */
export function validateSessionValue(value: string | undefined, cfg: AuthConfig): AdminSession | null {
  const session = unseal<AdminSession>(value, cfg.sessionSecret, SESSION_PURPOSE);
  if (!session) return null;
  if (session.exp < Math.floor(Date.now() / 1000)) return null;
  if (!Array.isArray(session.groups) || !session.groups.includes(cfg.adminGroup)) return null;
  return session;
}

/**
 * Reads and validates the admin session from the encrypted cookie.
 * Deny by default: any error, expiry or missing ADMIN group returns null.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  let cfg: AuthConfig;
  try {
    cfg = getAuthConfig();
  } catch (e) {
    if (e instanceof ConfigError) return null;
    throw e;
  }
  const jar = await cookies();
  return validateSessionValue(jar.get(sessionCookieName(cfg))?.value, cfg);
}

/** Use at the top of every admin page and server action. Redirects to login when not an admin. */
export async function requireAdmin(nextPath?: string): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect(`/admin/login${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`);
  return session;
}

/**
 * Same-origin check for state-changing route handlers (defence in depth
 * on top of SameSite cookies). Server Actions have this built in.
 */
export async function isSameOrigin() {
  let cfg: AuthConfig;
  try {
    cfg = getAuthConfig();
  } catch {
    return false;
  }
  const h = await headers();
  const origin = h.get("origin");
  return !!origin && safeEqual(origin, new URL(cfg.baseUrl).origin);
}

/** Only allow redirects to admin paths on this site (prevents open redirects). */
export function safeAdminPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/admin") || value.startsWith("//") || value.includes("\\") || value.startsWith("/admin/auth")) return "/admin";
  return value;
}
