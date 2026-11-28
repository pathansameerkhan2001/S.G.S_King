import { ArrowRight, Home } from "lucide-react";
import Link from "next/link";

import { HeritageLandscape, LeafSprig, Mandala } from "@/components/decor/Ornaments";
import { DrawOnView } from "@/components/heritage/DrawOnView";

/** Branded 404 content (wrapped with storefront chrome where needed). */
export function NotFoundContent() {
  return (
    <section aria-labelledby="not-found-title" className="hero-backdrop relative isolate overflow-hidden pb-40 pt-14 sm:pb-56 sm:pt-20">
      <Mandala className="pointer-events-none absolute -right-24 -top-24 -z-10 size-[340px] text-gold opacity-[0.14]" />
      <div className="mx-auto max-w-xl px-4 text-center">
        <p className="font-display text-[5.5rem] font-bold leading-none text-gold/70 sm:text-[7rem]">404</p>
        <div aria-hidden="true" className="mt-2 flex items-center justify-center gap-2">
          <span className="h-px w-16 bg-gradient-to-r from-gold/0 to-gold" />
          <LeafSprig className="h-4 w-7 text-gold-deep" />
          <span className="h-px w-16 bg-gradient-to-l from-gold/0 to-gold" />
        </div>
        <h1 id="not-found-title" className="mt-4 font-display text-[2.2rem] font-bold text-burgundy sm:text-[2.8rem]">
          Page not found
        </h1>
        <p className="mt-2 font-display text-[1.15rem] text-ink/80">
          Looks like this path wandered off into the Rayalaseema hills. Let&rsquo;s get you back to something delicious.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex h-12 items-center gap-2 rounded-xl bg-burgundy px-7 font-display text-[1.1rem] font-semibold text-ivory hover:bg-maroon-light">
            <Home aria-hidden="true" className="size-4" />
            Back to Home
          </Link>
          <Link href="/shop" className="inline-flex h-12 items-center gap-2 rounded-xl border-[1.5px] border-burgundy px-7 font-display text-[1.1rem] font-semibold text-burgundy hover:bg-gold-pale">
            Browse Products
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
      <DrawOnView className="pointer-events-none absolute inset-x-0 bottom-0 -z-10">
        <HeritageLandscape className="mx-auto h-auto w-full max-w-[1200px] text-sepia opacity-50" />
      </DrawOnView>
    </section>
  );
}
