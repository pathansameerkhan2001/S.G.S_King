import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Crown } from "@/components/decor/Crown";
import { GoldFlourish } from "@/components/decor/Ornaments";
import { bestSellersSection } from "@/content/bestSellers";
import { bestSellers } from "@/content/products";

import { BestSellersGrid } from "./BestSellersGrid";
import { TrustStrip } from "./TrustStrip";

export function BestSellersSection() {
  return (
    <section
      aria-labelledby="best-sellers-heading"
      className="relative isolate overflow-hidden bg-gradient-to-b from-cream via-[#faf2e4] to-ivory py-14 sm:py-16 lg:py-24"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent"
      />

      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-16">
        {/* Heading */}
        <header className="mx-auto max-w-2xl text-center">
          <Crown className="mx-auto h-7 w-11 text-gold sm:h-8 sm:w-12" />
          <h2
            id="best-sellers-heading"
            className="mt-3 font-display text-[2.3rem] font-bold leading-[1.05] tracking-[-0.01em] text-burgundy sm:text-5xl lg:text-[3.4rem]"
          >
            {bestSellersSection.heading}
          </h2>
          <p className="mt-2 font-display text-[1.1rem] italic text-umber sm:text-[1.3rem]">
            {bestSellersSection.subtitle}
          </p>
          <GoldFlourish className="mx-auto mt-4 h-3.5 w-24 text-gold" />
        </header>

        <div className="mx-auto mt-8 max-w-[1280px] sm:mt-10 lg:mt-12">
          <TrustStrip />

          <div className="mt-6 sm:mt-8 lg:mt-10">
            <BestSellersGrid products={bestSellers} />
          </div>

          <div className="mt-9 text-center sm:mt-12">
            <Link
              href={bestSellersSection.viewAll.href}
              className="group inline-flex h-12 items-center gap-2.5 rounded-xl border-[1.5px] border-burgundy bg-ivory/70 px-7 font-display text-[1.1rem] font-semibold text-burgundy transition-all duration-300 hover:-translate-y-0.5 hover:bg-burgundy hover:text-ivory sm:h-14 sm:px-9 sm:text-[1.2rem]"
            >
              {bestSellersSection.viewAll.label}
              <ArrowRight
                aria-hidden="true"
                className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2}
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
