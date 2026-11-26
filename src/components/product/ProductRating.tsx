import { Star } from "lucide-react";

import type { ProductRating as Rating } from "@/content/products";

/**
 * Star rating row. Renders nothing unless real review data exists —
 * never pass placeholder ratings.
 */
export function ProductRating({ rating }: { rating: Rating | null }) {
  if (!rating || rating.count <= 0) return null;
  const rounded = Math.round(rating.average * 2) / 2;

  return (
    <p className="flex items-center gap-1.5">
      <span className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`size-3.5 ${n <= rounded ? "fill-gold text-gold" : "text-gold/40"}`}
            strokeWidth={1.5}
          />
        ))}
      </span>
      <span className="font-sans text-xs text-umber">
        <span className="sr-only">Rated {rating.average.toFixed(1)} out of 5, </span>
        ({rating.count.toLocaleString("en-IN")}
        <span className="sr-only"> reviews</span>)
      </span>
    </p>
  );
}
