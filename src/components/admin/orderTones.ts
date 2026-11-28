import type { Order } from "@/lib/admin/schemas";

export const statusTone = (s: Order["status"]) =>
  (({ pending: "warn", confirmed: "info", packed: "info", shipped: "info", delivered: "good", cancelled: "bad" }) as const)[s];
export const paymentTone = (s: Order["payment"]["status"]) => (({ pending: "warn", paid: "good", failed: "bad", refunded: "neutral" }) as const)[s];
