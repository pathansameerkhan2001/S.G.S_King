import { MapPin } from "lucide-react";

import { brand } from "@/content/site";

export function LocationBadge({ className = "" }: { className?: string }) {
  return (
    <p
      className={`inline-flex items-center gap-2 rounded-full border border-gold/70 bg-ivory/85 px-4 py-1.5 font-display text-[1rem] font-semibold text-ink shadow-[0_4px_14px_-6px_rgba(123,90,64,0.35)] ring-1 ring-ivory/80 ring-offset-0 backdrop-blur-[2px] sm:px-5 sm:py-2 sm:text-[1.08rem] ${className}`}
    >
      <MapPin aria-hidden="true" className="size-5 fill-burgundy text-ivory" strokeWidth={1.6} />
      <span>
        <span className="sr-only">Based in </span>
        {brand.location}
      </span>
    </p>
  );
}
