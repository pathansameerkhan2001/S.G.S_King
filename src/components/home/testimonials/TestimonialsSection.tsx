"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

import { Mandala } from "@/components/decor/Ornaments";
import { activeTestimonials, testimonialsSection } from "@/content/testimonials";

import { TestimonialCard } from "./TestimonialCard";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Desktop: 4 across. Tablet: 2 per row. Mobile: swipeable row (≈1.2 cards),
 * contained in its own scroller so the page never overflows.
 */
export function TestimonialsSection() {
  if (activeTestimonials.length === 0) return null;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative isolate overflow-hidden bg-gradient-to-b from-ivory via-cream to-[#f3e6cf] pb-14 pt-10 sm:pb-16 lg:pb-20 lg:pt-14"
    >
      <Mandala className="pointer-events-none absolute -right-28 -top-24 -z-10 size-[340px] text-gold opacity-[0.12]" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/45 to-transparent"
      />

      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-16">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease }}
          className="mx-auto max-w-5xl text-center"
        >
          <h2
            id="testimonials-heading"
            className="text-balance font-display text-[2.1rem] font-bold leading-[1.1] tracking-[-0.01em] text-burgundy sm:text-5xl lg:text-[3.2rem]"
          >
            {testimonialsSection.heading}
            <Heart
              aria-hidden="true"
              className="ml-2 inline-block size-[0.8em] -translate-y-[0.06em] fill-[#c8102e] text-[#c8102e] drop-shadow-[0_4px_8px_rgba(200,16,46,0.3)]"
            />
          </h2>
          <div aria-hidden="true" className="mx-auto mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-gradient-to-r from-gold/0 to-gold sm:w-20" />
            <span className="size-1.5 rotate-45 bg-gold" />
            <span className="h-px w-12 bg-gradient-to-l from-gold/0 to-gold sm:w-20" />
          </div>
        </motion.header>

        <ul
          aria-label="Customer reviews"
          className={[
            "mx-auto mt-8 flex max-w-[1280px] snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "sm:mt-10 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible lg:grid-cols-4 lg:gap-5 xl:gap-7",
          ].join(" ")}
        >
          {activeTestimonials.map((testimonial, index) => (
            <motion.li
              key={testimonial.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease }}
              className="w-[80%] max-w-[320px] shrink-0 snap-center sm:w-auto sm:max-w-none"
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
