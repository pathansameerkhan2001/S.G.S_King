import { LeafSprig } from "@/components/decor/Ornaments";
import { comboSection, featuredCombos } from "@/content/combos";

import { ComboCarousel } from "./ComboCarousel";

export function ComboProductsSection() {
  return (
    <section
      aria-labelledby="combo-products-heading"
      className="relative isolate overflow-hidden bg-gradient-to-b from-ivory to-cream pb-14 pt-6 sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-10"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-16">
        <header className="mx-auto max-w-2xl text-center">
          {/* Ornament: gold rule — leaf sprig — gold rule */}
          <div aria-hidden="true" className="flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold sm:w-20" />
            <LeafSprig className="h-4 w-7 text-gold-deep" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold sm:w-20" />
          </div>
          <h2
            id="combo-products-heading"
            className="mt-3 font-display text-[2.3rem] font-bold leading-[1.05] tracking-[-0.01em] text-burgundy sm:text-5xl lg:text-[3.4rem]"
          >
            {comboSection.heading}
          </h2>
          <p className="mt-2 text-balance font-display text-[1.1rem] italic text-umber sm:text-[1.3rem]">
            {comboSection.subtitle}
          </p>
          <div aria-hidden="true" className="mx-auto mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-10 bg-gold/60" />
            <span className="size-1.5 rotate-45 bg-gold" />
            <span className="h-px w-10 bg-gold/60" />
          </div>
        </header>

        <div className="mx-auto mt-6 max-w-[1280px] sm:mt-8">
          <ComboCarousel combos={featuredCombos} />
        </div>
      </div>
    </section>
  );
}
