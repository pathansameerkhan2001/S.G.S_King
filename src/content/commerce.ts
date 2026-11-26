/**
 * Store business rules (admin-managed later).
 *
 * Values marked TO CONFIRM must be supplied by the business. Until then the
 * UI says "to be confirmed" instead of showing invented charges.
 */
export const commerce = {
  /** Flat delivery fee in rupees. null = not yet confirmed (TO CONFIRM). */
  deliveryFee: null as number | null,
  /** Order value above which delivery is free. null = no rule yet (TO CONFIRM). */
  freeDeliveryAbove: null as number | null,
  deliveryNote: "Delivery charges, if any, will be confirmed with you before dispatch.",
  /** Online orders are not processed by the website yet (no backend / gateway). */
  onlineOrderingLive: false,
  /** Online payment gateway integration status. */
  onlinePaymentLive: false,
  /** Max quantity per cart line. */
  maxQuantity: 20,
} as const;
