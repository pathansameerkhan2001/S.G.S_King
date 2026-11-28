"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { LeafSprig, Mandala } from "@/components/decor/Ornaments";

/** Branded error state for unexpected runtime errors in any page. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface for monitoring once an error-reporting service is configured.
    console.error(error);
  }, [error]);

  return (
    <section aria-labelledby="error-title" className="hero-backdrop relative isolate overflow-hidden py-20 sm:py-28">
      <Mandala className="pointer-events-none absolute -right-24 -top-24 -z-10 size-[320px] text-gold opacity-[0.14]" />
      <div className="mx-auto max-w-xl px-4 text-center">
        <div aria-hidden="true" className="flex items-center justify-center gap-2">
          <span className="h-px w-16 bg-gradient-to-r from-gold/0 to-gold" />
          <LeafSprig className="h-4 w-7 text-gold-deep" />
          <span className="h-px w-16 bg-gradient-to-l from-gold/0 to-gold" />
        </div>
        <h1 id="error-title" className="mt-4 font-display text-[2.2rem] font-bold text-burgundy sm:text-[2.7rem]">
          Something went wrong
        </h1>
        <p className="mt-2 font-display text-[1.15rem] text-ink/80">
          Sorry, this page couldn&rsquo;t load properly. Please try again; your cart and wishlist are safe.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-burgundy px-7 font-display text-[1.1rem] font-semibold text-ivory hover:bg-maroon-light"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            Try again
          </button>
          <Link href="/" className="inline-flex h-12 items-center rounded-xl border-[1.5px] border-burgundy px-7 font-display text-[1.1rem] font-semibold text-burgundy hover:bg-gold-pale">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
