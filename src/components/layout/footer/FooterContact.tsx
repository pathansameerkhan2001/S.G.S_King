import { ChevronRight, ExternalLink, Mail, MapPin, MapPinned, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { business, mailHref, mapsHref, telHref, whatsappHref } from "@/content/contact";

import { FooterHeading } from "./FooterHeading";

function Item({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3.5 border-b border-gold/20 py-3 last:border-b-0 sm:gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-gold/40 bg-gold-pale/70 text-gold-deep">
        <Icon aria-hidden="true" className="size-5" strokeWidth={1.6} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-[1.12rem] font-bold leading-tight text-burgundy">{title}</p>
        <div className="mt-0.5 font-sans text-[0.88rem] leading-relaxed text-ink/85">{children}</div>
      </div>
    </li>
  );
}

const inlineLink =
  "inline-flex min-h-11 items-center [overflow-wrap:anywhere] underline decoration-gold/0 underline-offset-4 transition-colors hover:text-burgundy hover:decoration-gold";

export function FooterContact() {
  return (
    <section aria-labelledby="footer-contact">
      <FooterHeading id="footer-contact">Get in Touch</FooterHeading>
      {/* Two columns on tablets (where this column spans the full width) */}
      <ul className="grid sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-1">
        <Item icon={Mail} title="Email">
          <a href={mailHref(business.email)} className={inlineLink}>
            {business.email}
          </a>
        </Item>

        <Item icon={Phone} title="Phone">
          <span className="flex flex-wrap items-center gap-x-3">
            {business.phones.map((phone, i) => (
              <span key={phone} className="inline-flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="h-4 w-px bg-umber/40" />}
                <a href={telHref(phone)} className={inlineLink} aria-label={`Call ${phone}`}>
                  {phone}
                </a>
              </span>
            ))}
          </span>
        </Item>

        <Item icon={MessageCircle} title="WhatsApp Orders">
          <a
            href={whatsappHref(business.whatsapp, "Hello S.G.S King Foods, I would like to place an order.")}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-burgundy"
          >
            Chat with us on WhatsApp
            <ChevronRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </Item>

        <Item icon={MapPin} title="Business Address">
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group block transition-colors hover:text-burgundy"
          >
            <address className="not-italic">
              {business.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <span className="mt-1 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-burgundy">
              View on Google Maps
              <ExternalLink aria-hidden="true" className="size-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </span>
          </a>
        </Item>

        <Item icon={MapPinned} title="Our Origin">
          {business.origin}
        </Item>
      </ul>
    </section>
  );
}
