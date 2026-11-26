import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { categoryHref, type Category } from "@/content/categories";

type CollectionCardProps = {
  category: Category;
  /** Horizontal layout, used for the odd final card on small screens. */
  wide?: boolean;
};

/**
 * Clickable collection tile. The whole card is one link; its accessible
 * name is the category title (the image is decorative inside the link).
 */
export function CollectionCard({ category, wide = false }: CollectionCardProps) {
  const { image } = category;

  return (
    <Link
      href={categoryHref(category.slug)}
      className={[
        "group relative flex h-full overflow-hidden rounded-2xl border border-gold/30 bg-ivory",
        "shadow-[0_10px_30px_-20px_rgba(53,23,15,0.45)] transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1.5 hover:border-gold/70 hover:shadow-[0_24px_44px_-22px_rgba(101,10,22,0.45)]",
        "focus-visible:-translate-y-1.5 focus-visible:border-gold/70",
        wide ? "flex-row items-stretch md:flex-col" : "flex-col",
      ].join(" ")}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden bg-cream ${
          wide ? "aspect-[5/4] w-1/2 shrink-0 md:w-full" : "aspect-[5/4] w-full"
        }`}
      >
        <Image
          src={image.src}
          alt=""
          fill
          unoptimized={image.src.endsWith(".svg")}
          sizes="(min-width: 1280px) 300px, (min-width: 768px) 24vw, 50vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
        {/* Inner gold hairline frame */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 rounded-xl border border-ivory/60 transition-colors duration-500 group-hover:border-gold-soft/90 sm:inset-2.5"
        />
      </div>

      {/* Text */}
      <div
        className={`relative flex flex-1 flex-col items-center justify-center px-3 text-center ${
          wide ? "py-4 md:pb-5 md:pt-4" : "pb-4 pt-3.5 sm:pb-5 sm:pt-4"
        }`}
      >
        <span aria-hidden="true" className="mb-2 flex items-center gap-1.5">
          <span className="h-px w-5 bg-gold/60 transition-all duration-500 group-hover:w-8" />
          <span className="size-1.5 rotate-45 bg-gold" />
          <span className="h-px w-5 bg-gold/60 transition-all duration-500 group-hover:w-8" />
        </span>
        {/* Two lines reserved so every card in the grid keeps the same height */}
        <h3 className="flex min-h-[2.5em] items-center text-balance font-display text-[1.05rem] font-semibold leading-[1.2] text-burgundy min-[400px]:text-[1.12rem] sm:text-[1.25rem] md:text-[1.08rem] lg:text-[1.2rem] xl:text-[1.3rem]">
          {category.name}
        </h3>
        <span className="mt-1.5 inline-flex items-center gap-1 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-umber transition-colors duration-300 group-hover:text-burgundy sm:text-[0.75rem]">
          Explore
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={2.2}
          />
        </span>
      </div>
    </Link>
  );
}
