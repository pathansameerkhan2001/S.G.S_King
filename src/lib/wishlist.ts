"use client";

import { useCallback } from "react";

import { createPersistentStore, isStringArray } from "@/lib/persistentStore";

/**
 * Shared wishlist (frontend only, persisted in localStorage).
 * Stores catalogue item keys (`product:slug` / `combo:slug`).
 * FUTURE: sync with the customer's account once authentication exists.
 */
const store = createPersistentStore<string[]>("sgs-wishlist-v1", [], isStringArray);

export function toggleWishlist(key: string) {
  store.set((keys) => (keys.includes(key) ? keys.filter((k) => k !== key) : [key, ...keys]));
}

export function removeFromWishlist(key: string) {
  store.set((keys) => keys.filter((k) => k !== key));
}

export const useWishlistKeys = store.useStore;

export function useWishlist(key: string) {
  const keys = useWishlistKeys();
  const toggle = useCallback(() => toggleWishlist(key), [key]);
  return { isSaved: keys.includes(key), toggle };
}
