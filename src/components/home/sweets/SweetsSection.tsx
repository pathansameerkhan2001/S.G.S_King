import { LeafSprig, Mandala } from "@/components/decor/Ornaments";
import { sweetsAndChikkis, sweetsSection } from "@/content/sweets";

import { SweetsBrowser } from "./SweetsBrowser";

export function SweetsSection() {
  return (
    <section
      aria-labelledby="sweets-heading"
      className="relative isolate overflow-hidden bg-gradient-to-b from-cream to-ivory pb-14 pt-6 sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-10"
    >
      <Mandala className="pointer-events-none absolute -left-[130px] top-4 -z-10 size-[300px] text-gold opacity-[0.12] lg:size-[360px]" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent"
      />

      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-16">
        <header className="mx-auto max-w-2xl pt-4 text-center sm:pt-6">
          <p className="inline-flex items-center gap-2.5 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-umber sm:text-xs">
            <LeafSprig className="h-3 w-5 text-gold-deep" />
            {sweetsSection.eyebrow}
            <LeafSprig className="h-3 w-5 text-gold-deep" />
          </p>
          <h2
            id="sweets-heading"
            className="mt-2 font-display text-[2.3rem] font-bold leading-[1.05] tracking-[-0.01em] text-burgundy sm:text-5xl lg:text-[3.4rem]"
          >
            {sweetsSection.heading}
          </h2>
          <p className="mt-2 text-balance font-display text-[1.1rem] italic text-umber sm:text-[1.3rem]">
            {sweetsSection.subtitle}
          </p>
          <div aria-hidden="true" className="mx-auto mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-10 bg-gold/60" />
            <span className="size-1.5 rotate-45 bg-gold" />
            <span className="h-px w-10 bg-gold/60" />
          </div>
        </header>

        <div className="mx-auto mt-6 max-w-[1280px] sm:mt-7">
          <SweetsBrowser products={sweetsAndChikkis} />
        </div>
      </div>
    </section>
  );
}
