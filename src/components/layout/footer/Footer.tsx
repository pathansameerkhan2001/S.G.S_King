import { GoldFlourish, HeritageLandscape, LeafSprig, Mandala } from "@/components/decor/Ornaments";
import { DrawOnView } from "@/components/heritage/DrawOnView";
import { footerCopy } from "@/content/footer";

import { FooterBottomBar } from "./FooterBottomBar";
import { FooterBrand } from "./FooterBrand";
import { FooterContact } from "./FooterContact";
import { FooterCategories, FooterExplore } from "./FooterLinks";

/**
 * Site footer.
 * ≥1024px: 4 columns with gold dividers. 640–1023px: brand on top, Explore +
 * Categories side by side, contact full width (2 inner columns).
 * <640px: stacked.
 */
export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-gold/40 bg-gradient-to-b from-ivory to-cream">
      {/* Heritage decoration (decorative only, low opacity) */}
      <Mandala className="pointer-events-none absolute -right-24 -top-24 -z-10 size-[320px] text-gold opacity-[0.12]" />
      <Mandala className="pointer-events-none absolute -left-28 -top-28 -z-10 hidden size-[300px] text-gold opacity-[0.1] lg:block" />
      <DrawOnView className="pointer-events-none absolute bottom-0 left-0 -z-10 w-[min(70%,560px)]">
        <HeritageLandscape className="h-auto w-full text-sepia opacity-35" />
      </DrawOnView>
      <HeritageLandscape className="pointer-events-none absolute bottom-0 right-0 -z-10 hidden h-auto w-[min(40%,520px)] -scale-x-100 text-sepia opacity-30 md:block" />

      <div className="mx-auto max-w-[1440px] px-4 pb-7 pt-8 sm:px-8 sm:pb-8 sm:pt-10 lg:px-10 lg:pt-14 xl:px-16">
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 sm:gap-y-9 lg:grid-cols-[1fr_0.8fr_1.15fr_1.25fr] lg:gap-x-0">
          <div className="sm:col-span-2 lg:col-span-1 lg:pr-8">
            <FooterBrand />
          </div>
          <div className="lg:border-l lg:border-gold/30 lg:px-8">
            <FooterExplore />
          </div>
          <div className="lg:border-l lg:border-gold/30 lg:px-8">
            <FooterCategories />
          </div>
          <div className="sm:col-span-2 lg:col-span-1 lg:border-l lg:border-gold/30 lg:pl-8">
            <FooterContact />
          </div>
        </div>

        {/* Closing tagline */}
        <div className="mt-8 flex flex-col items-center gap-2 sm:mt-10 lg:mt-12">
          <div aria-hidden="true" className="flex items-center gap-2">
            <span className="h-px w-16 bg-gradient-to-r from-gold/0 to-gold sm:w-32" />
            <LeafSprig className="h-4 w-7 text-gold-deep" />
            <span className="h-px w-16 bg-gradient-to-l from-gold/0 to-gold sm:w-32" />
          </div>
          <p className="flex items-center gap-3 text-center font-display text-[1.2rem] italic text-burgundy sm:text-[1.45rem]">
            <GoldFlourish className="hidden h-3 w-16 shrink-0 text-gold sm:block" />
            {footerCopy.tagline}
            <GoldFlourish className="hidden h-3 w-16 shrink-0 text-gold sm:block" />
          </p>
        </div>
      </div>

      <FooterBottomBar />
    </footer>
  );
}
