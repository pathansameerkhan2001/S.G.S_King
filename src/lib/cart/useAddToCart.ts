"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Product } from "@/content/products";

export type AddToCartStatus = "idle" | "adding" | "added" | "error";

/**
 * DEMO ONLY — there is no cart backend yet.
 * Simulates a short request so the button can show its states. Nothing is
 * stored. FUTURE: replace this function with the real cart API / store call
 * (and update the header cart count from that store).
 */
async function addToCartDemo(product: Pick<Product, "id">, quantity: number): Promise<void> {
  void product;
  void quantity;
  await new Promise((resolve) => setTimeout(resolve, 450));
}

const ADDED_RESET_MS = 2000;

export function useAddToCart(product: Pick<Product, "id">) {
  const [status, setStatus] = useState<AddToCartStatus>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const add = useCallback(
    async (quantity = 1) => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
      setStatus("adding");
      try {
        await addToCartDemo(product, quantity);
        setStatus("added");
      } catch {
        setStatus("error");
      }
      resetTimer.current = setTimeout(() => setStatus("idle"), ADDED_RESET_MS);
    },
    [product],
  );

  return { status, add };
}
