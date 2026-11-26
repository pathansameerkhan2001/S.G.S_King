"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CurvedUnderline, HeritageLandscape, LeafSprig } from "@/components/decor/Ornaments";
import { hero } from "@/content/site";

import { LocationBadge } from "./LocationBadge";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const ctaBase =
  "group inline-flex h-[3.25rem] items-center justify-center gap-3 rounded-xl px-7 font-display text-[1.15rem] font-semibold transition-all duration-300 sm:h-14 sm:px-8 sm:text-[1.2rem] xl:h-[3.75rem] xl:px-9 xl:text-[1.3rem]";

export function HeroContent({ headingId }: { headingId: string }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative z-10 w-full max-w-[640px] lg:w-[52%] lg:max-w-[600px] xl:max-w-[640px]"
    >
      {/* Eyebrow badge */}
      <motion.p
        variants={item}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-gold/80 bg-gold-pale/85 px-3.5 py-1.5 font-display text-[clamp(0.92rem,4.3vw,1.05rem)] font-semibold text-ink shadow-[inset_0_0_0_3px_rgba(255,249,240,0.7)] sm:gap-3 sm:px-6 sm:text-[1.15rem] xl:text-[1.3rem]"
      >
        <LeafSprig className="h-3.5 w-5 text-gold-deep sm:h-4 sm:w-6" />
        {hero.eyebrow}
        <LeafSprig className="h-3.5 w-5 text-gold-deep sm:h-4 sm:w-6" />
      </motion.p>

      {/* Headline */}
      <motion.h1
        id={headingId}
        variants={item}
        className="mt-6 font-display text-[clamp(2rem,calc(11.6vw_-_2px),3.9rem)] font-bold leading-[1] tracking-[-0.012em] text-burgundy sm:mt-7 lg:text-[3.5rem] xl:mt-8 xl:text-[4.6rem] 2xl:text-[4.85rem]"
      >
        <span className="block">{hero.headingLine1}</span>
        <span className="relative inline-block pb-[0.18em]">
          {hero.headingLine2}
          <CurvedUnderline className="absolute bottom-[-0.04em] left-[34%] h-[0.26em] w-[70%] text-gold" />
        </span>
      </motion.h1>

      {/* Supporting copy */}
      <motion.p
        variants={item}
        className="mt-5 max-w-[31rem] text-pretty font-display text-[1.2rem] leading-[1.4] text-ink/90 sm:text-[1.3rem] xl:mt-7 xl:text-[1.42rem] xl:leading-[1.36]"
      >
        {hero.description}
      </motion.p>

      {/* CTAs */}
      <motion.div
        variants={item}
        className="mt-7 flex flex-wrap gap-3 sm:gap-4 xl:mt-9 xl:gap-8 [&>*]:grow sm:[&>*]:grow-0"
      >
        <Link
          href={hero.primaryCta.href}
          className={`${ctaBase} bg-burgundy text-ivory shadow-soft hover:-translate-y-0.5 hover:bg-maroon-light hover:shadow-[0_16px_32px_-14px_rgba(101,10,22,0.6)] active:translate-y-0`}
        >
          {hero.primaryCta.label}
          <ArrowRight
            aria-hidden="true"
            className="size-5 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={2}
          />
        </Link>
        <Link
          href={hero.secondaryCta.href}
          className={`${ctaBase} border-[1.5px] border-burgundy bg-ivory/70 text-burgundy hover:-translate-y-0.5 hover:bg-gold-pale active:translate-y-0`}
        >
          {hero.secondaryCta.label}
          <ArrowRight
            aria-hidden="true"
            className="size-5 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={2}
          />
        </Link>
      </motion.div>

      {/* Mobile / tablet: landscape sketch with the location badge on top */}
      <motion.div variants={item} className="relative mt-5 h-[84px] sm:mt-6 sm:h-[100px] lg:hidden">
        <HeritageLandscape className="absolute -left-4 bottom-0 h-full w-[calc(100%+2rem)] text-sepia opacity-55 sm:-left-6" />
        <LocationBadge className="absolute bottom-2 left-0" />
      </motion.div>
    </motion.div>
  );
}
