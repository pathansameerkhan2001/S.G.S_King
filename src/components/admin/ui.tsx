import { AlertTriangle, ChevronRight, Inbox } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

/** Shared presentational pieces for admin pages (server-compatible). */

export type AdminCrumb = { label: string; href?: string };

export function AdminPageHeader({
  title,
  description,
  crumbs = [],
  actions,
}: {
  title: string;
  description?: string;
  crumbs?: AdminCrumb[];
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 font-sans text-xs text-umber">
            {[{ label: "Admin", href: "/admin" }, ...crumbs].map((c, i, all) => (
              <li key={`${c.label}-${i}`} className="flex items-center gap-1">
                {c.href && i < all.length - 1 ? (
                  <Link href={c.href} className="hover:text-burgundy hover:underline">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current={i === all.length - 1 ? "page" : undefined}>{c.label}</span>
                )}
                {i < all.length - 1 && <ChevronRight aria-hidden="true" className="size-3 text-gold-deep" />}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-1 font-display text-[1.9rem] font-bold leading-tight text-burgundy sm:text-[2.2rem]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl font-sans text-sm text-umber">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-gold/25 bg-ivory p-4 shadow-[0_10px_30px_-26px_rgba(53,23,15,0.6)] sm:p-5 ${className}`}>{children}</section>;
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-gold/50 bg-ivory/70 px-6 py-12 text-center">
      <Inbox aria-hidden="true" className="mx-auto size-8 text-gold-deep" strokeWidth={1.5} />
      <p className="mt-3 font-display text-[1.35rem] font-semibold text-burgundy">{title}</p>
      {text && <p className="mx-auto mt-1 max-w-md font-sans text-sm text-umber">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ title, text, details }: { title: string; text: string; details?: string[] }) {
  return (
    <div role="alert" className="rounded-2xl border border-burgundy/30 bg-[#fff6f4] p-5">
      <p className="flex items-center gap-2 font-display text-[1.3rem] font-bold text-burgundy">
        <AlertTriangle aria-hidden="true" className="size-5" />
        {title}
      </p>
      <p className="mt-1 font-sans text-sm text-ink/85">{text}</p>
      {details && details.length > 0 && (
        <ul className="mt-2 list-disc pl-5 font-mono text-xs text-ink/80">
          {details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const primaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-burgundy px-5 font-sans text-sm font-semibold text-ivory shadow-soft transition-colors hover:bg-maroon-light disabled:cursor-not-allowed disabled:opacity-60";
export const secondaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gold/50 bg-ivory px-4 font-sans text-sm font-semibold text-burgundy transition-colors hover:bg-gold-pale disabled:opacity-60";
export const dangerButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-burgundy/40 bg-[#fff3f1] px-4 font-sans text-sm font-semibold text-burgundy transition-colors hover:bg-burgundy hover:text-ivory";

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "warn" | "bad" | "info" }) {
  const tones = {
    neutral: "bg-gold-pale text-umber",
    good: "bg-[#e7f4ea] text-[#2f7a3d]",
    warn: "bg-[#fff1d6] text-[#9a5b00]",
    bad: "bg-[#fde8e6] text-burgundy",
    info: "bg-[#e8eefc] text-[#2b4c9a]",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

/** Responsive table wrapper: scrolls inside itself on small screens (never the page). */
export function TableWrap({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div role="region" aria-label={label} tabIndex={0} className="overflow-x-auto rounded-2xl border border-gold/25 bg-ivory focus-visible:outline-2">
      <table className="w-full min-w-[640px] border-collapse font-sans text-sm">{children}</table>
    </div>
  );
}

export const th = "border-b border-gold/25 bg-cream/60 px-4 py-3 text-left font-semibold text-umber";
export const td = "border-b border-gold/15 px-4 py-3 align-middle text-ink";

export const formatInr = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
export const formatDate = (iso: string) =>
  iso ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(iso)) : "—";

export const matchesQ = (q: string | undefined, ...fields: (string | undefined)[]) => {
  const needle = q?.trim().toLowerCase();
  if (!needle) return true;
  return fields.some((f) => f?.toLowerCase().includes(needle));
};

export function AdminLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="space-y-3">
      <span className="sr-only">{label}…</span>
      <div className="h-8 w-56 animate-pulse rounded-lg bg-gold-pale/70 motion-reduce:animate-none" />
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-xl bg-gold-pale/50 motion-reduce:animate-none" />
      ))}
    </div>
  );
}

/** Success/error banner from ?saved= / ?deleted= / ?error= query params after redirects. */
export function Flash({ params }: { params: Record<string, string | string[] | undefined> }) {
  const pick = (k: string) => (typeof params[k] === "string" ? (params[k] as string) : undefined);
  const error = pick("error");
  const saved = pick("saved");
  const deleted = pick("deleted");
  if (error) return <p role="alert" className="mb-4 rounded-xl bg-[#fde8e6] px-4 py-3 font-sans text-sm font-semibold text-burgundy">{error}</p>;
  if (saved || deleted)
    return (
      <p role="status" className="mb-4 rounded-xl bg-[#e7f4ea] px-4 py-3 font-sans text-sm font-semibold text-[#2f7a3d]">
        {deleted ? "Deleted." : `Saved “${saved}”.`}
      </p>
    );
  return null;
}
