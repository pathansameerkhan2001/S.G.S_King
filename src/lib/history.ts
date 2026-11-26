"use client";

import { createPersistentStore, isStringArray } from "@/lib/persistentStore";

/** Recently viewed products/combos (item keys, newest first). */
const viewed = createPersistentStore<string[]>("sgs-recently-viewed-v1", [], isStringArray);

export function recordView(key: string) {
  viewed.set((keys) => [key, ...keys.filter((k) => k !== key)].slice(0, 12));
}
export const useRecentlyViewed = viewed.useStore;

/** Recent search queries (newest first). Stored only on this device. */
const searches = createPersistentStore<string[]>("sgs-recent-searches-v1", [], isStringArray);

export function recordSearch(query: string) {
  const q = query.trim();
  if (q.length < 2) return;
  searches.set((list) => [q, ...list.filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 6));
}
export function clearRecentSearches() {
  searches.set(() => []);
}
export const useRecentSearches = searches.useStore;
