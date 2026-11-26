"use client";

import { ExternalLink, MapPinned } from "lucide-react";
import { useState } from "react";

import { HeritageLandscape } from "@/components/decor/Ornaments";

/**
 * Google Map that loads only when the visitor asks for it: no third-party
 * requests or cookies on page load, and the page never waits on Google.
 */
export function ClickToLoadMap({ embedUrl, mapsUrl, title }: { embedUrl: string; mapsUrl: string; title: string }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return <iframe title={title} src={embedUrl} referrerPolicy="no-referrer-when-downgrade" className="block h-72 w-full sm:h-80" />;
  }

  return (
    <div className="relative isolate flex h-72 flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-b from-gold-pale/60 to-cream px-4 text-center sm:h-80">
      <HeritageLandscape aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-auto w-full text-sepia opacity-35" />
      <MapPinned aria-hidden="true" className="size-9 text-gold-deep" strokeWidth={1.4} />
      <p className="font-display text-[1.2rem] font-semibold text-burgundy">Jagadam Palli, Kadapa</p>
      <div className="flex flex-wrap justify-center gap-2.5">
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="inline-flex h-11 items-center rounded-xl bg-burgundy px-5 font-display text-[1.05rem] font-semibold text-ivory hover:bg-maroon-light"
        >
          Show map
        </button>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-1.5 rounded-xl border-[1.5px] border-burgundy px-5 font-display text-[1.05rem] font-semibold text-burgundy hover:bg-gold-pale"
        >
          Open in Google Maps
          <ExternalLink aria-hidden="true" className="size-4" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
      <p className="font-sans text-xs text-umber">The map is provided by Google and loads only when you choose.</p>
    </div>
  );
}
