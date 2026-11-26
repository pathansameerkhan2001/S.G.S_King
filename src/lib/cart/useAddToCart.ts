"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { addToCart } from "./store";

export type AddToCartStatus = "idle" | "added" | "error";

const ADDED_RESET_MS = 1800;

/**
 * Adds an item to the shared cart and exposes a short-lived "added" state
 * for button feedback.
 */
export function useAddToCart(itemKey: string, variantId?: string) {
  const [status, setStatus] = useState<AddToCartStatus>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const add = useCallback(
    (quantity = 1) => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
      const ok = addToCart(itemKey, variantId, quantity);
      setStatus(ok ? "added" : "error");
      resetTimer.current = setTimeout(() => setStatus("idle"), ADDED_RESET_MS);
      return ok;
    },
    [itemKey, variantId],
  );

  return { status, add };
}
