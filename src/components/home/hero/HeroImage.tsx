"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { assets } from "@/content/site";

/**
 * Product still-life. Below `lg` it sits under the copy, fading in from
 * the top; from `lg` up it fills the right side and fades in from the left,
 * so it blends into the cream backdrop without a hard edge.
 */
export function HeroImage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "relative -mt-6 aspect-[5/4] w-full sm:-mt-8 sm:aspect-[16/10] md:aspect-[16/9]",
        "[mask-image:linear-gradient(to_bottom,transparent_0%,#000_20%)]",
        "lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:aspect-auto lg:w-[56%] xl:w-[58%]",
        "lg:[mask-image:linear-gradient(to_right,transparent_0%,rgb(0_0_0/0.55)_10%,#000_24%)]",
      ].join(" ")}
    >
      <Image
        src={assets.hero.src}
        alt={assets.hero.alt}
        fill
        preload
        sizes="(min-width: 1280px) 58vw, (min-width: 1024px) 56vw, 100vw"
        className="object-cover object-[50%_58%] lg:object-[24%_center]"
      />
      {/* Warm vignette to tie the photo into the palette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,transparent_55%,rgba(101,10,22,0.12))]"
      />
    </motion.div>
  );
}
