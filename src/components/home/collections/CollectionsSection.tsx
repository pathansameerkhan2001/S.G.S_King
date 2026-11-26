import { GoldFlourish, LeafSprig, Mandala } from "@/components/decor/Ornaments";
import { collectionsSection } from "@/content/site";

import { CollectionsCarousel } from "./CollectionsCarousel";

export function CollectionsSection() {
  return (
    <section
      aria-labelledby="collections-heading"
      className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-ivory to-cream py-14 sm:py-16 lg:py-24"
    >
      {/* Heritage accents */}
      <Mandala className="pointer-events-none absolute -right-[120px] top-6 -z-10 size-[300px] text-gold opacity-[0.14] lg:size-[380px]" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
      />

      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-16">
        <header className="mx-auto mb-9 max-w-2xl text-center sm:mb-12 lg:mb-14">
          <p className="inline-flex items-center gap-2.5 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-umber sm:text-xs">
            <LeafSprig className="h-3 w-5 text-gold-deep" />
            {collectionsSection.eyebrow}
            <LeafSprig className="h-3 w-5 text-gold-deep" />
          </p>
          <h2
            id="collections-heading"
            className="mt-3 font-display text-[2.3rem] font-bold leading-[1.05] tracking-[-0.01em] text-burgundy sm:text-5xl lg:text-[3.4rem]"
          >
            {collectionsSection.heading}
          </h2>
          <GoldFlourish className="mx-auto mt-4 h-3.5 w-24 text-gold" />
          <p className="mx-auto mt-4 max-w-xl text-pretty font-display text-[1.1rem] leading-relaxed text-ink/80 sm:text-[1.2rem]">
            {collectionsSection.description}
          </p>
        </header>
      </div>

      {/* Full-bleed within the section; edges fade out softly */}
      <div className="mx-auto w-full max-w-[1600px]">
        <CollectionsCarousel />
      </div>
    </section>
  );
}
