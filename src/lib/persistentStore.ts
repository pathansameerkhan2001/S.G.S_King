"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny external store persisted to localStorage, shared by cart, wishlist,
 * recently viewed and recent searches.
 *
 * - Server render and hydration use `initial`, so markup never mismatches;
 *   the stored value is applied right after hydration.
 * - Changes sync across browser tabs via the `storage` event.
 * FUTURE: swap the storage calls for API calls when accounts/backend exist.
 */
export function createPersistentStore<T>(storageKey: string, initial: T, validate: (value: unknown) => value is T) {
  let state: T = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (validate(parsed)) state = parsed;
      }
    } catch {
      // Corrupt or blocked storage: keep the initial value.
    }
  };

  const emit = () => listeners.forEach((listener) => listener());

  const subscribe = (listener: () => void) => {
    load();
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) return;
      loaded = false;
      state = initial;
      load();
      emit();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  const get = () => {
    load();
    return state;
  };

  const set = (updater: (previous: T) => T) => {
    load();
    state = updater(state);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Storage full or unavailable: keep in-memory state.
    }
    emit();
  };

  function useStore() {
    return useSyncExternalStore(subscribe, get, () => initial);
  }

  return { get, set, useStore };
}

export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === "string");
