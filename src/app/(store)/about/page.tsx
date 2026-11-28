import { ArrowRight, CheckCircle2, Heart, Leaf, PackageCheck, ScrollText } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { HeritageLandscape, Mandala } from "@/components/decor/Ornaments";
import { DrawOnView } from "@/components/heritage/DrawOnView";
import { Parallax } from "@/components/heritage/Parallax";
import { Reveal } from "@/components/heritage/Reveal";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about } from "@/content/about";
import { assets } from "@/content/site";

export const metadata: Metadata = {
  title: "About Us",
  description: about.hero.description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About S.G.S King Foods", description: about.hero.description, url: "/about" },
};

const valueIcons = { scroll: ScrollText, leaf: Leaf, package: PackageCheck, heart: Heart };

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={about.hero.eyebrow}
        title={about.hero.title}
        description={about.hero.description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      {/* Who we are */}
      <section aria-labelledby="who-we-are" className="heritage-paper py-14 sm:py-20">
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-10 px-4 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <Reveal>
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-[2rem] border border-gold/40 shadow-card">
              <Image src={assets.hero.src} alt={assets.hero.alt} fill sizes="(min-width: 1024px) 520px, 92vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading id="who-we-are" title={about.intro.title} align="left" eyebrow="S.G.S King Foods" />
            <div className="mt-4 space-y-4 font-display text-[1.15rem] leading-relaxed text-ink/85">
              {about.intro.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Our story (placeholder until provided) */}
      <section aria-labelledby="our-story" className="relative isolate overflow-hidden bg-cream/60 py-14 sm:py-20">
        <Mandala className="pointer-events-none absolute -left-24 top-6 -z-10 size-[300px] text-gold opacity-[0.12]" />
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-8">
          <SectionHeading id="our-story" title={about.story.title} />
          <p className="mt-6 rounded-2xl border border-dashed border-gold/60 bg-ivory/80 p-6 font-display text-[1.15rem] italic text-umber">
            {about.story.placeholder}
          </p>
        </div>
      </section>

      {/* Roots + landscape */}
      <section aria-labelledby="roots" className="relative isolate overflow-hidden heritage-paper pb-40 pt-14 sm:pb-56 sm:pt-20">
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-8">
          <SectionHeading id="roots" title={about.roots.title} eyebrow="Our Roots" />
          <div className="mt-5 space-y-4 font-display text-[1.15rem] leading-relaxed text-ink/85">
            {about.roots.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <Parallax className="pointer-events-none absolute inset-x-0 bottom-0 -z-10" distance={50}>
          <DrawOnView>
            <HeritageLandscape className="mx-auto h-auto w-full max-w-[1300px] text-sepia opacity-55" />
          </DrawOnView>
        </Parallax>
      </section>

      {/* Values */}
      <section aria-labelledby="values" className="border-y border-gold/25 bg-ivory py-14 sm:py-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-10">
          <SectionHeading id="values" title="Our Philosophy" subtitle="Quality, freshness and care in every pack" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((v, i) => {
              const Icon = valueIcons[v.icon];
              return (
                <Reveal key={v.title} as="li" delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-gold/30 bg-cream/50 p-6 text-center">
                    <span className="mx-auto grid size-14 place-items-center rounded-full border border-gold/45 bg-gold-pale text-burgundy">
                      <Icon aria-hidden="true" className="size-6" strokeWidth={1.5} />
                    </span>
                    <h3 className="mt-4 font-display text-[1.35rem] font-bold text-burgundy">{v.title}</h3>
                    <p className="mt-2 font-sans text-[0.9rem] leading-relaxed text-ink/80">{v.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Commitment */}
      <section aria-labelledby="commitment" className="heritage-paper py-14 sm:py-20">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-8">
          <SectionHeading id="commitment" title={about.commitment.title} />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {about.commitment.points.map((p) => (
              <li key={p} className="flex gap-3 rounded-xl border border-gold/30 bg-ivory p-4 font-sans text-[0.95rem] text-ink/85">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-gold-deep" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="about-cta" className="relative isolate overflow-hidden bg-burgundy py-14 text-center text-ivory sm:py-16">
        <Mandala className="pointer-events-none absolute -right-20 -top-24 -z-10 size-[320px] text-gold opacity-20" />
        <div className="mx-auto max-w-2xl px-4">
          <h2 id="about-cta" className="font-display text-[2.2rem] font-bold sm:text-[2.8rem]">
            {about.cta.title}
          </h2>
          <p className="mt-2 font-display text-[1.15rem] text-ivory/85">{about.cta.text}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="inline-flex h-12 items-center gap-2 rounded-xl bg-ivory px-7 font-display text-[1.1rem] font-semibold text-burgundy hover:bg-gold-pale">
              Explore Our Products
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link href="/contact" className="inline-flex h-12 items-center rounded-xl border-[1.5px] border-gold-soft px-7 font-display text-[1.1rem] font-semibold text-ivory hover:bg-white/10">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
