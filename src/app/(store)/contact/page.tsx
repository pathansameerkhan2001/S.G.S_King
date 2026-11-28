import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ClickToLoadMap } from "@/components/contact/ClickToLoadMap";
import { ContactForm } from "@/components/contact/ContactForm";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { PageHero } from "@/components/ui/PageHero";
import { business, businessHours, mailHref, mapsHref, telHref, whatsappHref } from "@/content/contact";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact S.G.S King Foods in Kadapa by phone, WhatsApp or email, or send us a message.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact Us | S.G.S King Foods", url: "/contact" },
};

const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(
  "Malika Complex, Jagadam Palli, Kadapa 516001, Andhra Pradesh",
)}&output=embed`;

function Card({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4 rounded-2xl border border-gold/30 bg-ivory p-4 sm:p-5">
      <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-gold/40 bg-gold-pale/70 text-gold-deep">{icon}</span>
      <div className="min-w-0">
        <h3 className="font-display text-[1.2rem] font-bold text-burgundy">{title}</h3>
        <div className="mt-0.5 font-sans text-[0.9rem] leading-relaxed text-ink/85">{children}</div>
      </div>
    </li>
  );
}

const link = "inline-flex min-h-10 items-center [overflow-wrap:anywhere] hover:text-burgundy hover:underline";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="We'd love to hear from you"
        title="Contact Us"
        description="Questions about our products, bulk or gifting orders, or an order you've placed? Reach us on WhatsApp, phone or email, or send a message below."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section aria-label="Contact details and form" className="heritage-paper">
        <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[400px_1fr] lg:px-10 lg:py-16">
          <div>
            <h2 className="font-display text-[1.8rem] font-bold text-burgundy">Get in touch</h2>
            <ul className="mt-4 space-y-3">
              <Card icon={<WhatsAppIcon className="size-5 text-[#1fa855]" />} title="WhatsApp">
                <a href={whatsappHref(business.whatsapp, "Hello S.G.S King Foods, I have a question.")} target="_blank" rel="noopener noreferrer" className={link}>
                  +91 {business.whatsapp} <span className="sr-only">(opens WhatsApp in a new tab)</span>
                </a>
                <p className="text-xs text-umber">Fastest way to reach us for orders.</p>
              </Card>
              <Card icon={<Phone aria-hidden="true" className="size-5" />} title="Phone">
                <span className="flex flex-wrap gap-x-4">
                  {business.phones.map((p) => (
                    <a key={p} href={telHref(p)} className={link}>
                      +91 {p}
                    </a>
                  ))}
                </span>
              </Card>
              <Card icon={<Mail aria-hidden="true" className="size-5" />} title="Email">
                <a href={mailHref(business.email)} className={link}>
                  {business.email}
                </a>
              </Card>
              <Card icon={<MapPin aria-hidden="true" className="size-5" />} title="Business Address">
                <address className="not-italic">
                  {business.addressLines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
                <a href={mapsHref} target="_blank" rel="noopener noreferrer" className={`${link} font-semibold text-burgundy`}>
                  Open in Google Maps <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Card>
              <Card icon={<Clock aria-hidden="true" className="size-5" />} title="Business Hours">
                {businessHours.length > 0 ? (
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4">
                    {businessHours.map((h) => (
                      <div key={h.days} className="contents">
                        <dt className="font-semibold">{h.days}</dt>
                        <dd>{h.hours}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p>Our business hours will be listed here once confirmed. WhatsApp messages are answered as soon as we can.</p>
                )}
              </Card>
            </ul>
          </div>

          <div>
            <div className="rounded-2xl border border-gold/35 bg-ivory p-5 shadow-[0_18px_40px_-30px_rgba(53,23,15,0.55)] sm:p-8">
              <h2 className="font-display text-[1.8rem] font-bold text-burgundy">Send us a message</h2>
              <p className="mb-5 mt-1 font-sans text-sm text-umber">Fields marked * are required.</p>
              <ContactForm />
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-gold/35">
              <ClickToLoadMap title="Map showing S.G.S King Foods, Jagadam Palli, Kadapa" embedUrl={mapEmbed} mapsUrl={mapsHref} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
