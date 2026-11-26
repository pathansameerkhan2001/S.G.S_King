const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Formats whole rupees, e.g. 1299 → "₹1,299". */
export const formatPrice = (rupees: number) => inr.format(rupees);
