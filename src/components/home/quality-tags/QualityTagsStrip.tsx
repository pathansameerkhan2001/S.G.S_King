import {
  Droplet,
  FlaskConicalOff,
  HandHeart,
  Heart,
  Leaf,
  PackageCheck,
  ScrollText,
  ShieldCheck,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { Fragment } from "react";

import { activeQualityTags, type QualityTagIcon } from "@/content/qualityTags";

const icons: Record<QualityTagIcon, LucideIcon> = {
  heart: Heart,
  leaf: Leaf,
  scroll: ScrollText,
  "hand-heart": HandHeart,
  package: PackageCheck,
  droplet: Droplet,
  sprout: Sprout,
  shield: ShieldCheck,
  "flask-off": FlaskConicalOff,
};

/**
 * Slim brand-quality strip below the hero.
 * Desktop: centred row with gold diamond separators.
 * Mobile: a single swipeable row with soft edge fades (scrolls within itself,
 * never the page).
 */
export function QualityTagsStrip() {
  if (activeQualityTags.length === 0) return null;

  return (
    <section aria-label="The S.G.S King promise" className="relative border-y border-gold/30 bg-ivory">
      <div
        className={[
          "mx-auto max-w-[1440px] overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "[mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)] lg:[mask-image:none]",
        ].join(" ")}
      >
        <ul className="mx-auto flex w-max items-center gap-4 px-6 py-3 sm:gap-6 sm:py-3.5 lg:gap-3 xl:gap-10 xl:px-10">
          {activeQualityTags.map((tag, i) => {
            const Icon = icons[tag.icon];
            return (
              <Fragment key={tag.id}>
                {i > 0 && (
                  <li aria-hidden="true" className="flex">
                    <span className="size-1.5 rotate-45 bg-gold/70" />
                  </li>
                )}
                <li className="flex items-center gap-2 whitespace-nowrap">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-gold/45 bg-gold-pale/70 text-burgundy sm:size-8 lg:size-7 xl:size-8">
                    <Icon aria-hidden="true" className="size-3.5 sm:size-4" strokeWidth={1.7} />
                  </span>
                  <span className="font-display text-[0.98rem] font-semibold text-burgundy sm:text-[1.05rem] lg:text-[0.98rem] xl:text-[1.05rem]">
                    {tag.label}
                  </span>
                </li>
              </Fragment>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
