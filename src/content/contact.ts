/**
 * Business contact details and social accounts (single source of truth).
 * Used by the footer; reuse anywhere contact info is needed.
 */

export const business = {
  name: "S.G.S King Foods",
  email: "sgskingfoods@gmail.com",
  /** Display format; digits only are used for tel: links. */
  phones: ["9010608410", "9704925775"],
  /**
   * Number used for WhatsApp orders (Indian mobile, without +91).
   * CONFIRM this is the WhatsApp-enabled business number.
   */
  whatsapp: "9010608410",
  addressLines: [
    "9/583-2, Beside Sangam Marriage Hall,",
    "Malika Complex, Jagadam Palli,",
    "Kadapa – 516 001, Andhra Pradesh, India.",
  ],
  origin: "Kadapa, Rayalaseema, Andhra Pradesh.",
} as const;

/**
 * Business hours (TO CONFIRM). Leave empty until the business confirms
 * them; the contact page then shows "to be confirmed" instead of guessing.
 * Example: [{ days: "Monday – Saturday", hours: "9:00 AM – 7:00 PM" }]
 */
export const businessHours: { days: string; hours: string }[] = [];

export const telHref = (phone: string) => `tel:+91${phone.replace(/\D/g, "")}`;
export const mailHref = (email: string) => `mailto:${email}`;
export const whatsappHref = (phone: string, text?: string) =>
  `https://wa.me/91${phone.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "9/583-2, Beside Sangam Marriage Hall, Malika Complex, Jagadam Palli, Kadapa 516001, Andhra Pradesh, India",
)}`;

/**
 * Social accounts. Leave `url` undefined until the real profile exists:
 * accounts without a URL are not rendered (no fake links).
 */
export type SocialAccount = { id: "instagram" | "facebook" | "youtube"; label: string; url?: string };

export const socialAccounts: SocialAccount[] = [
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/sgs_king_foods/" },
  { id: "facebook", label: "Facebook", url: undefined },
  { id: "youtube", label: "YouTube", url: undefined },
];
