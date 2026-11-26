"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Frontend-only wishlist store (in memory, shared across components).
 * FUTURE: replace the body of `toggle` with an API call for signed-in
 * users and hydrate `saved` from their account.
 */
const saved = new Set<string>();
const listeners = new Set<() => void>();
let version = 0;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function toggle(id: string) {
  if (saved.has(id)) saved.delete(id);
  else saved.add(id);
  version += 1;
  listeners.forEach((listener) => listener());
}

export function useWishlist(id: string) {
  // `version` changes on every toggle so subscribers re-read the Set.
  const isSaved = useSyncExternalStore(
    subscribe,
    () => version >= 0 && saved.has(id),
    () => false,
  );
  const toggleSaved = useCallback(() => toggle(id), [id]);
  return { isSaved, toggle: toggleSaved };
}
