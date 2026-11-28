import "server-only";

import type { LibraryImage } from "@/components/admin/ImagePicker";

import { listMedia, signedUrl, type MediaFolder } from "./repo/media";

/** Media library items for pickers (signed preview URLs, 10 min). */
export async function mediaLibrary(folder?: MediaFolder): Promise<LibraryImage[]> {
  return (await listMedia(folder)).map((m) => ({ key: m.key, url: m.url, name: m.name }));
}

/** Signed preview URLs for already-selected keys. */
export async function previewsFor(keys: (string | undefined)[]): Promise<Record<string, string>> {
  const unique = [...new Set(keys.filter((k): k is string => !!k))];
  const entries = await Promise.all(unique.map(async (k) => [k, await signedUrl(k)] as const));
  return Object.fromEntries(entries);
}

/** Reads a JSON "payload" field posted by admin forms. */
export function readPayload<T = unknown>(formData: FormData): T | null {
  try {
    const raw = formData.get("payload");
    return typeof raw === "string" && raw.length < 200_000 ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
