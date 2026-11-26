import { BadgeCheck, Camera, Star } from "lucide-react";
import Image from "next/image";

import type { Testimonial } from "@/content/testimonials";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { reviewImage, rating } = testimonial;
  const stars = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <article className="group flex h-full flex-col items-center rounded-[1.5rem] border border-gold/25 bg-ivory p-4 text-center shadow-[0_14px_36px_-24px_rgba(53,23,15,0.5)] transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_26px_48px_-26px_rgba(101,10,22,0.45)] sm:p-5">
      {/* Review image: fixed portrait ratio (phone screenshots), never distorted */}
      <div className="relative aspect-[9/16] w-full max-w-[200px] overflow-hidden rounded-xl">
        {reviewImage ? (
          <Image
            src={reviewImage.src}
            alt={reviewImage.alt}
            fill
            sizes="200px"
            className="bg-ink object-contain transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-gold/60 bg-gradient-to-b from-gold-pale/80 via-cream to-gold-pale/50">
            <span className="grid size-12 place-items-center rounded-full border border-gold/50 bg-ivory/80 text-gold-deep">
              <Camera aria-hidden="true" className="size-5" strokeWidth={1.6} />
            </span>
            <span className="px-3 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-umber/80">
              Customer review image
            </span>
          </div>
        )}
      </div>

      {/* Rating */}
      <p className="mt-4 flex items-center gap-0.5" aria-label={`Rated ${stars} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            aria-hidden="true"
            className={`size-5 ${i < stars ? "fill-gold text-gold" : "text-gold/35"}`}
            strokeWidth={1.4}
          />
        ))}
      </p>

      <blockquote className="mt-2 flex-1">
        <p className="text-pretty font-display text-[1.12rem] leading-snug text-ink/90 sm:text-[1.18rem]">
          &ldquo;{testimonial.reviewText}&rdquo;
        </p>
      </blockquote>

      <footer className="mt-4 flex flex-col items-center gap-1.5">
        <p className="font-display text-[1.1rem] font-bold text-burgundy">
          {testimonial.customerName}
          {testimonial.location && <span className="font-normal text-umber">, {testimonial.location}</span>}
        </p>
        {testimonial.isDemo ? (
          <span className="rounded-full border border-gold/50 bg-gold-pale/60 px-2.5 py-0.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-umber">
            Sample review
          </span>
        ) : (
          testimonial.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e7f4ea] px-2.5 py-0.5 font-sans text-[0.7rem] font-semibold text-[#2f7a3d]">
              <BadgeCheck aria-hidden="true" className="size-3.5" />
              Verified Customer
            </span>
          )
        )}
      </footer>
    </article>
  );
}
