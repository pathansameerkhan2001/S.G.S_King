"use client";

import { business, mailHref, whatsappHref } from "@/content/contact";
import type { CartSummary, ResolvedLine } from "@/lib/cart/store";
import { formatPrice } from "@/lib/format";

/**
 * Checkout output. There is NO order backend yet, so a checkout produces an
 * "order request" kept in sessionStorage; the customer then sends it to the
 * business (WhatsApp / email) to actually place the order.
 * FUTURE: POST this payload to the orders API and use the returned order ID.
 */
export type CheckoutDetails = {
  fullName: string;
  phone: string;
  email: string;
  house: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  addressType: "home" | "work" | "other";
  paymentMethod: "cod" | "online";
};

export type OrderRequest = {
  details: CheckoutDetails;
  items: { name: string; variant: string; quantity: number; unitPrice: number; lineTotal: number }[];
  summary: CartSummary;
  createdAt: string;
};

const KEY = "sgs-order-request-v1";

export function saveOrderRequest(details: CheckoutDetails, resolved: ResolvedLine[], summary: CartSummary) {
  const request: OrderRequest = {
    details,
    items: resolved.map((r) => ({
      name: r.item.name,
      variant: r.variant.label,
      quantity: r.line.quantity,
      unitPrice: r.variant.price,
      lineTotal: r.lineTotal,
    })),
    summary,
    createdAt: new Date().toISOString(),
  };
  sessionStorage.setItem(KEY, JSON.stringify(request));
  return request;
}

let snapshotRaw: string | null | undefined;
let snapshot: { value: OrderRequest | null } = { value: null };

/** Stable snapshot for useSyncExternalStore; re-reads when the stored request changes. */
export function getOrderRequestSnapshot() {
  const raw = sessionStorage.getItem(KEY);
  if (raw !== snapshotRaw) {
    snapshotRaw = raw;
    snapshot = { value: loadOrderRequest() };
  }
  return snapshot;
}

export function loadOrderRequest(): OrderRequest | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OrderRequest) : null;
  } catch {
    return null;
  }
}

export function formatAddress(d: CheckoutDetails) {
  return [d.house, d.street, d.area, d.landmark && `Landmark: ${d.landmark}`, `${d.city}, ${d.state} - ${d.pincode}`]
    .filter(Boolean)
    .join(", ");
}

export function orderMessage(r: OrderRequest) {
  const lines = [
    "Hello S.G.S King Foods, I would like to place this order:",
    "",
    ...r.items.map((i) => `• ${i.name} (${i.variant}) × ${i.quantity} = ${formatPrice(i.lineTotal)}`),
    "",
    `Subtotal: ${formatPrice(r.summary.subtotal)}`,
    `Delivery: ${r.summary.delivery === null ? "to be confirmed" : formatPrice(r.summary.delivery)}`,
    `Total: ${formatPrice(r.summary.total)}`,
    `Payment: ${r.details.paymentMethod === "cod" ? "Cash on Delivery (if available)" : "Online payment"}`,
    "",
    `Name: ${r.details.fullName}`,
    `Phone: ${r.details.phone}`,
    r.details.email ? `Email: ${r.details.email}` : "",
    `Address (${r.details.addressType}): ${formatAddress(r.details)}`,
  ];
  return lines.filter((l, i, all) => l !== "" || all[i - 1] !== "").join("\n");
}

export const orderWhatsappHref = (r: OrderRequest) => whatsappHref(business.whatsapp, orderMessage(r));
export const orderEmailHref = (r: OrderRequest) =>
  `${mailHref(business.email)}?subject=${encodeURIComponent(`Order request from ${r.details.fullName}`)}&body=${encodeURIComponent(orderMessage(r))}`;

// ---------------------------------------------------------------- validation

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export const isValidIndianMobile = (v: string) => /^(?:\+?91[-\s]?)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ""));
export const isValidPincode = (v: string) => /^[1-9]\d{5}$/.test(v.trim());
export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
