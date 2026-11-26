import type { ReactNode } from "react";

import { HeritageLandscape, LeafSprig, Mandala } from "@/components/decor/Ornaments";
import { MangoLeaves, SunRays } from "@/components/heritage/Botanicals";
import { DrawOnView } from "@/components/heritage/DrawOnView";
import { GoldParticles } from "@/components/heritage/GoldParticles";
import { Parallax } from "@/components/heritage/Parallax";

import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

type PageHeroProps = {
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  children?: ReactNode;
  /** Compact variant for utility pages (cart, checkout, policies). */
  compact?: boolean;
};

/**
 * Shared hero for inner pages: warm gradient, faint mandala, gold particles
 * and a Rayalaseema landscape that draws itself (with gentle parallax).
 */
export function PageHero({ title, eyebrow, description, breadcrumbs, children, compact = false }: PageHeroProps) {
  return (
    <section
      aria-labelledby="page-title"
      className={`hero-backdrop relative isolate overflow-hidden border-b border-gold/25 ${
        compact ? "pb-8 pt-6 sm:pb-10 sm:pt-8" : "pb-14 pt-6 sm:pb-20 sm:pt-8 lg:pb-24"
      }`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 -z-10 w-[min(1100px,140%)] -translate-x-1/2 opacity-60">
        <SunRays className="h-auto w-full" />
      </div>
      <Mandala className="pointer-events-none absolute -right-24 -top-20 -z-10 size-[280px] text-gold opacity-[0.14] sm:size-[340px]" />
      <MangoLeaves className="pointer-events-none absolute -left-6 -top-4 -z-10 hidden size-40 text-[#6f8a3c] opacity-30 sm:block lg:size-52" />
      <GoldParticles />
      <Parallax className="pointer-events-none absolute inset-x-0 bottom-0 -z-10" distance={20}>
        <DrawOnView>
          <HeritageLandscape className="mx-auto h-auto w-full max-w-[720px] text-sepia opacity-25" />
        </DrawOnView>
      </Parallax>

      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-8 lg:px-10">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className={`mx-auto max-w-3xl text-center ${compact ? "mt-4" : "mt-8 sm:mt-10"}`}>
          {eyebrow && (
            <p className="inline-flex items-center gap-2.5 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-umber sm:text-xs">
              <LeafSprig className="h-3 w-5 text-gold-deep" />
              {eyebrow}
              <LeafSprig className="h-3 w-5 text-gold-deep" />
            </p>
          )}
          <h1
            id="page-title"
            className={`text-balance font-display font-bold leading-[1.05] tracking-[-0.01em] text-burgundy ${
              compact ? "mt-2 text-[2.1rem] sm:text-[2.6rem]" : "mt-3 text-[2.5rem] sm:text-6xl lg:text-[4rem]"
            }`}
          >
            {title}
          </h1>
          <div aria-hidden="true" className="mx-auto mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-gradient-to-r from-gold/0 to-gold sm:w-20" />
            <span className="size-1.5 rotate-45 bg-gold" />
            <span className="h-px w-12 bg-gradient-to-l from-gold/0 to-gold sm:w-20" />
          </div>
          {description && (
            <div className="mx-auto mt-4 max-w-2xl text-pretty font-display text-[1.12rem] leading-relaxed text-ink/85 sm:text-[1.25rem]">
              {description}
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
