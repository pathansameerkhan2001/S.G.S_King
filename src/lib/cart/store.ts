"use client";

import { commerce } from "@/content/commerce";
import { getItemByKey, getVariant, type CatalogItem, type CatalogVariant } from "@/lib/catalog";
import { createPersistentStore } from "@/lib/persistentStore";

/**
 * Shared cart (frontend only, persisted in localStorage).
 * Only references (item key + variant id + quantity) are stored; names and
 * prices are always resolved from the catalogue, so they never go stale.
 * FUTURE: replace with the cart API once the backend exists.
 */
export type CartLine = { itemKey: string; variantId: string; quantity: number };

const isCartLines = (value: unknown): value is CartLine[] =>
  Array.isArray(value) &&
  value.every(
    (l) =>
      l &&
      typeof l === "object" &&
      typeof (l as CartLine).itemKey === "string" &&
      typeof (l as CartLine).variantId === "string" &&
      typeof (l as CartLine).quantity === "number",
  );

const EMPTY: CartLine[] = [];
const store = createPersistentStore<CartLine[]>("sgs-cart-v1", EMPTY, isCartLines);

export const lineId = (line: Pick<CartLine, "itemKey" | "variantId">) => `${line.itemKey}|${line.variantId}`;

const clamp = (n: number) => Math.max(1, Math.min(commerce.maxQuantity, Math.round(n)));

export function addToCart(itemKey: string, variantId: string | undefined, quantity = 1) {
  const item = getItemByKey(itemKey);
  if (!item || item.availability === "out_of_stock") return false;
  const variant = getVariant(item, variantId);
  store.set((lines) => {
    const id = lineId({ itemKey, variantId: variant.id });
    const existing = lines.find((l) => lineId(l) === id);
    if (existing) {
      return lines.map((l) => (l === existing ? { ...l, quantity: clamp(l.quantity + quantity) } : l));
    }
    return [...lines, { itemKey, variantId: variant.id, quantity: clamp(quantity) }];
  });
  return true;
}

export function setQuantity(id: string, quantity: number) {
  store.set((lines) => lines.map((l) => (lineId(l) === id ? { ...l, quantity: clamp(quantity) } : l)));
}

export function removeFromCart(id: string) {
  store.set((lines) => lines.filter((l) => lineId(l) !== id));
}

export function clearCart() {
  store.set(() => EMPTY);
}

export const useCartLines = store.useStore;

export type ResolvedLine = {
  id: string;
  line: CartLine;
  item: CatalogItem;
  variant: CatalogVariant;
  lineTotal: number;
  lineMrp: number;
};

/** Joins cart lines with catalogue data; drops lines whose item no longer exists. */
export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  return lines.flatMap((line) => {
    const item = getItemByKey(line.itemKey);
    if (!item) return [];
    const variant = getVariant(item, line.variantId);
    return [
      {
        id: lineId(line),
        line,
        item,
        variant,
        lineTotal: variant.price * line.quantity,
        lineMrp: (variant.mrp ?? variant.price) * line.quantity,
      },
    ];
  });
}

export type CartSummary = {
  itemCount: number;
  subtotal: number;
  /** Savings vs original prices, from catalogue MRP data (not invented). */
  savings: number;
  /** null = delivery fee not yet confirmed by the business. */
  delivery: number | null;
  total: number;
};

export function summarise(resolved: ResolvedLine[]): CartSummary {
  const subtotal = resolved.reduce((n, r) => n + r.lineTotal, 0);
  const mrpTotal = resolved.reduce((n, r) => n + r.lineMrp, 0);
  const itemCount = resolved.reduce((n, r) => n + r.line.quantity, 0);
  let delivery: number | null = commerce.deliveryFee;
  if (delivery !== null && commerce.freeDeliveryAbove !== null && subtotal >= commerce.freeDeliveryAbove) delivery = 0;
  return { itemCount, subtotal, savings: mrpTotal - subtotal, delivery, total: subtotal + (delivery ?? 0) };
}

export function useCart() {
  const lines = useCartLines();
  const resolved = resolveLines(lines);
  return { lines, resolved, summary: summarise(resolved) };
}

export function useCartCount() {
  return useCartLines().reduce((n, l) => n + l.quantity, 0);
}
