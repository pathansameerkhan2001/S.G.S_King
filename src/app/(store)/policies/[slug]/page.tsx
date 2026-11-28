import { AlertTriangle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/ui/PageHero";
import { getPolicy, policies } from "@/content/policies";

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/policies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) return {};
  return {
    title: policy.title,
    description: policy.summary,
    alternates: { canonical: `/policies/${policy.slug}` },
    // Draft policies are not indexed until approved.
    robots: policy.status === "draft" ? { index: false, follow: true } : undefined,
  };
}

/** Renders [bracketed] placeholder text in a visibly marked style. */
function PolicyText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <p>
      {parts.map((part, i) =>
        part.startsWith("[") ? (
          <mark key={i} className="rounded bg-gold-pale px-1 text-umber">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </p>
  );
}

export default async function PolicyPage({ params }: PageProps<"/policies/[slug]">) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  return (
    <>
      <PageHero compact title={policy.title} description={policy.summary} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Policies" }, { label: policy.title }]} />
      <section aria-label={policy.title} className="heritage-paper">
        <div className="mx-auto grid w-full max-w-[1100px] gap-8 px-4 py-10 sm:px-8 lg:grid-cols-[220px_1fr] lg:py-14">
          <nav aria-label="Policies" className="lg:sticky lg:top-28 lg:self-start">
            <ul className="flex flex-wrap gap-2 lg:flex-col">
              {policies.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/policies/${p.slug}`}
                    aria-current={p.slug === policy.slug ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-xl border px-4 font-display text-[1.05rem] font-semibold transition-colors lg:flex ${
                      p.slug === policy.slug ? "border-burgundy bg-burgundy text-ivory" : "border-gold/40 bg-ivory text-ink hover:border-burgundy"
                    }`}
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <article className="rounded-2xl border border-gold/30 bg-ivory p-6 sm:p-8">
            {policy.status === "draft" && (
              <div role="note" className="mb-6 flex gap-3 rounded-xl border border-gold/50 bg-gold-pale/60 p-4 font-sans text-sm text-ink">
                <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-gold-deep" />
                <p>
                  <strong>Draft: pending confirmation by S.G.S King Foods.</strong> This page is a working draft and is not yet an approved
                  policy. Highlighted text will be replaced with confirmed details. For questions, please{" "}
                  <Link href="/contact" className="font-semibold text-burgundy underline">
                    contact us
                  </Link>
                  .
                </p>
              </div>
            )}
            {policy.lastUpdated && <p className="mb-4 font-sans text-xs text-umber">Last updated: {policy.lastUpdated}</p>}
            <div className="space-y-7">
              {policy.sections.map((s, i) => (
                <section key={s.heading} aria-labelledby={`policy-section-${i}`}>
                  <h2 id={`policy-section-${i}`} className="font-display text-[1.5rem] font-bold text-burgundy">
                    {i + 1}. {s.heading}
                  </h2>
                  <div className="mt-2 space-y-2 font-sans text-[0.95rem] leading-relaxed text-ink/85">
                    {s.body.map((b) => (
                      <PolicyText key={b} text={b} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
