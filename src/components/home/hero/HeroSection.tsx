import { HeritageLandscape, Mandala } from "@/components/decor/Ornaments";

import { HeroContent } from "./HeroContent";
import { HeroImage } from "./HeroImage";
import { LocationBadge } from "./LocationBadge";

const containerClass = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10 xl:px-16";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="hero-backdrop relative isolate overflow-hidden lg:min-h-[600px] xl:min-h-[680px] 2xl:min-h-[720px]"
    >
      {/* Heritage decoration: partial mandala at the top-left edge */}
      <Mandala className="pointer-events-none absolute -left-[110px] -top-[70px] -z-10 size-[260px] text-gold opacity-25 sm:size-[300px] lg:-left-[120px] lg:top-[-40px] lg:size-[340px]" />

      {/* Desktop: sepia Rayalaseema landscape along the bottom-left */}
      <HeritageLandscape className="pointer-events-none absolute bottom-0 left-0 -z-10 hidden h-auto w-[min(54%,700px)] text-sepia opacity-75 lg:block" />

      <div className={`${containerClass} relative pt-9 sm:pt-12 lg:pb-40 lg:pt-[4.5rem] xl:pb-44 xl:pt-20`}>
        <HeroContent headingId="hero-heading" />
      </div>

      <HeroImage />

      {/* Desktop: location badge pinned bottom-left, aligned to the content edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden lg:block">
        <div className={`${containerClass} pb-8 xl:pb-10`}>
          <LocationBadge className="pointer-events-auto" />
        </div>
      </div>
    </section>
  );
}
