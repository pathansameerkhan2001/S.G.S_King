"use client";

import { Mail, Send } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { InputField, TextareaField } from "@/components/ui/FormField";
import {
  contactEmailHref,
  contactWhatsappHref,
  submitContactMessage,
  type ContactMessage,
  type SubmitResult,
} from "@/lib/contactForm";
import { isValidEmail, isValidIndianMobile } from "@/lib/order";

type Errors = Partial<Record<keyof ContactMessage, string>>;

const empty: ContactMessage = { name: "", email: "", phone: "", subject: "", message: "" };

function validate(m: ContactMessage): Errors {
  const e: Errors = {};
  if (m.name.trim().length < 2) e.name = "Please enter your name.";
  if (!isValidEmail(m.email)) e.email = "Please enter a valid email address.";
  if (m.phone.trim() && !isValidIndianMobile(m.phone)) e.phone = "Enter a valid 10-digit mobile number, or leave it blank.";
  if (m.message.trim().length < 10) e.message = "Please write a message (at least 10 characters).";
  return e;
}

export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const field = (key: keyof ContactMessage) => ({
    value: values[key],
    error: errors[key],
    onChange: (e: { target: { value: string } }) => {
      const next = { ...values, [key]: e.target.value };
      setValues(next);
      if (touched) setErrors(validate(next));
    },
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setBusy(true);
    const res = await submitContactMessage(values);
    setBusy(false);
    setResult(res);
    if (res.status === "sent") setValues(empty);
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-4" aria-describedby="contact-form-note">
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField id="contact-name" label="Name" required autoComplete="name" {...field("name")} />
        <InputField id="contact-email" label="Email" required type="email" autoComplete="email" {...field("email")} />
        <InputField id="contact-phone" label="Phone" type="tel" inputMode="tel" autoComplete="tel" {...field("phone")} />
        <InputField id="contact-subject" label="Subject" {...field("subject")} />
      </div>
      <TextareaField id="contact-message" label="Message" required {...field("message")} />

      <p id="contact-form-note" className="font-sans text-xs text-umber">
        We use your details only to reply to your message.
      </p>

      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-12 items-center gap-2 rounded-xl bg-burgundy px-7 font-display text-[1.1rem] font-semibold text-ivory shadow-soft hover:bg-maroon-light disabled:opacity-70"
      >
        <Send aria-hidden="true" className="size-4" />
        {busy ? "Sending…" : "Send Message"}
      </button>

      <div ref={resultRef} tabIndex={-1} role="status" aria-live="polite" className="focus:outline-none">
        {result?.status === "sent" && (
          <p className="rounded-xl bg-[#e7f4ea] p-4 font-sans text-sm font-semibold text-[#2f7a3d]">
            Thank you! Your message has been sent. We&rsquo;ll get back to you soon.
          </p>
        )}
        {result?.status === "error" && (
          <p className="rounded-xl bg-[#fff5f5] p-4 font-sans text-sm font-semibold text-burgundy">{result.message}</p>
        )}
        {result?.status === "not_configured" && (
          <div className="rounded-xl border border-gold/40 bg-gold-pale/50 p-4">
            <p className="font-sans text-sm text-ink">
              <strong>Your message hasn&rsquo;t been sent yet.</strong> Our online form is still being connected. Please send it
              directly with one tap. Your message is already filled in:
            </p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              <a
                href={contactWhatsappHref(values)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#25D366] px-5 font-display text-[1.05rem] font-semibold text-white"
              >
                <WhatsAppIcon className="size-5" />
                Send via WhatsApp
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a
                href={contactEmailHref(values)}
                className="inline-flex h-11 items-center gap-2 rounded-xl border-[1.5px] border-burgundy px-5 font-display text-[1.05rem] font-semibold text-burgundy"
              >
                <Mail aria-hidden="true" className="size-4" />
                Send by Email
              </a>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
