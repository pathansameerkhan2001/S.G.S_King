import { business, mailHref, whatsappHref } from "@/content/contact";

export type ContactMessage = { name: string; email: string; phone: string; subject: string; message: string };

export type SubmitResult = { status: "sent" } | { status: "not_configured" } | { status: "error"; message: string };

/**
 * Endpoint for contact-form submissions. Leave undefined until the backend /
 * admin inbox exists; while undefined the form offers WhatsApp / email
 * instead of pretending the message was sent.
 */
export const CONTACT_ENDPOINT: string | undefined = undefined;

export async function submitContactMessage(message: ContactMessage): Promise<SubmitResult> {
  if (!CONTACT_ENDPOINT) return { status: "not_configured" };
  try {
    const res = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    return res.ok ? { status: "sent" } : { status: "error", message: "The server could not accept your message." };
  } catch {
    return { status: "error", message: "Network error. Please check your connection and try again." };
  }
}

const body = (m: ContactMessage) =>
  [m.message, "", `Name: ${m.name}`, m.phone && `Phone: ${m.phone}`, m.email && `Email: ${m.email}`].filter((x) => x !== "").join("\n");

export const contactWhatsappHref = (m: ContactMessage) =>
  whatsappHref(business.whatsapp, `Hello S.G.S King Foods,\n${m.subject ? `Subject: ${m.subject}\n` : ""}\n${body(m)}`);

export const contactEmailHref = (m: ContactMessage) =>
  `${mailHref(business.email)}?subject=${encodeURIComponent(m.subject || `Message from ${m.name}`)}&body=${encodeURIComponent(body(m))}`;
