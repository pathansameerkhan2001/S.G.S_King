import { MapPin, Truck } from "lucide-react";
import { Fragment } from "react";

import { GoldFlourish } from "@/components/decor/Ornaments";
import { announcements, type AnnouncementItem } from "@/content/site";

function ItemIcon({ icon }: { icon: AnnouncementItem["icon"] }) {
  if (icon === "truck") {
    return <Truck className="size-[18px] shrink-0" strokeWidth={1.6} aria-hidden="true" />;
  }
  if (icon === "location") {
    return <MapPin className="size-4 shrink-0 text-gold" strokeWidth={1.8} aria-hidden="true" />;
  }
  return null;
}

function Item({ item }: { item: AnnouncementItem }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <ItemIcon icon={item.icon} />
      <span
        className={
          item.highlight
            ? "text-gold-soft underline decoration-gold/70 underline-offset-[5px]"
            : undefined
        }
      >
        {item.label}
      </span>
    </span>
  );
}

const Divider = () => (
  <span aria-hidden="true" className="h-3.5 w-px shrink-0 bg-ivory/45" />
);

/**
 * Slim maroon promotional bar.
 * Desktop: all messages in one centred row.
 * Mobile: a slow ticker (paused on hover/focus), or one static line
 * when the visitor prefers reduced motion.
 */
export function AnnouncementBar() {
  return (
    <section
      aria-label="Store highlights"
      className="relative bg-burgundy text-ivory [background-image:linear-gradient(180deg,rgb(255_255_255/0.04),transparent)]"
    >
      {/* Desktop / tablet */}
      <div className="mx-auto hidden h-11 max-w-[1440px] items-center justify-center gap-5 px-6 font-display text-[0.98rem] tracking-[0.01em] lg:flex">
        <GoldFlourish className="h-3 w-14 shrink-0 text-gold" />
        <ul className="flex items-center gap-4">
          {announcements.map((item, i) => (
            <Fragment key={item.label}>
              {i > 0 && (
                <li aria-hidden="true" className="flex">
                  <Divider />
                </li>
              )}
              <li>
                <Item item={item} />
              </li>
            </Fragment>
          ))}
        </ul>
        <GoldFlourish className="h-3 w-14 shrink-0 text-gold" />
      </div>

      {/* Mobile: animated ticker */}
      <div className="ticker relative hidden h-9 items-center overflow-hidden font-display text-[0.92rem] motion-safe:flex lg:hidden!">
        <div className="ticker-track flex w-max animate-marquee items-center">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex shrink-0 items-center gap-5 pr-5"
            >
              {announcements.map((item) => (
                <Fragment key={item.label}>
                  <li>
                    <Item item={item} />
                  </li>
                  <li aria-hidden="true">
                    <GoldFlourish className="h-2.5 w-9 text-gold" />
                  </li>
                </Fragment>
              ))}
            </ul>
          ))}
        </div>
        {/* Soft fade at both edges */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-burgundy to-transparent" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-burgundy to-transparent" />
      </div>

      {/* Mobile: reduced motion, compact static line */}
      <div className="hidden h-9 items-center justify-center gap-2 px-4 font-display text-[0.9rem] motion-reduce:flex lg:hidden!">
        <Truck className="size-4 shrink-0" strokeWidth={1.6} aria-hidden="true" />
        <span className="whitespace-nowrap">Pan India Delivery</span>
        <span aria-hidden="true" className="text-gold">·</span>
        <span className="truncate text-gold-soft">From Kadapa, Rayalaseema</span>
      </div>
    </section>
  );
}
