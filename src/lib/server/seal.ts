import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Authenticated encryption (AES-256-GCM) for cookie payloads.
 * The cookie value is unreadable and tamper-evident; an expiry is embedded
 * and checked on every read.
 */

const VERSION = "v1";

const keyFrom = (secret: string, purpose: string) => createHash("sha256").update(`${purpose}:${secret}`).digest();

export function seal<T extends object>(payload: T, secret: string, purpose: string, ttlSeconds: number): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyFrom(secret, purpose), iv);
  const body = JSON.stringify({ ...payload, __exp: Math.floor(Date.now() / 1000) + ttlSeconds });
  const encrypted = Buffer.concat([cipher.update(body, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${VERSION}.${Buffer.concat([iv, tag, encrypted]).toString("base64url")}`;
}

export function unseal<T extends object>(value: string | undefined, secret: string, purpose: string): T | null {
  if (!value?.startsWith(`${VERSION}.`)) return null;
  try {
    const raw = Buffer.from(value.slice(VERSION.length + 1), "base64url");
    if (raw.length < 29) return null;
    const decipher = createDecipheriv("aes-256-gcm", keyFrom(secret, purpose), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const body = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
    const data = JSON.parse(body) as T & { __exp: number };
    if (typeof data.__exp !== "number" || data.__exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

export const randomToken = (bytes = 32) => randomBytes(bytes).toString("base64url");

export const pkceChallenge = (verifier: string) => createHash("sha256").update(verifier).digest("base64url");

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
