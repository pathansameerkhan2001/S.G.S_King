import { LockKeyhole, ShieldCheck, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { LeafSprig, Mandala } from "@/components/decor/Ornaments";
import { getAdminSession, safeAdminPath } from "@/lib/server/auth";
import { missingConfig } from "@/lib/server/env";

export const metadata: Metadata = { title: "Admin Sign In" };

const errors: Record<string, string> = {
  config: "The admin sign-in is not configured on this server yet.",
  denied: "Sign-in was cancelled.",
  state: "Your sign-in session expired or was invalid. Please try again.",
  exchange: "We couldn't complete sign-in with Cognito. Please try again.",
  token: "The sign-in token could not be verified. Please try again.",
  forbidden: "This account is not an administrator. Access to the admin panel is restricted to the ADMIN group.",
};

async function LoginContent({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const next = safeAdminPath(typeof params.next === "string" ? params.next : null);
  if (await getAdminSession()) redirect(next);

  const errorKey = typeof params.error === "string" ? params.error : undefined;
  const missing = missingConfig().filter((m) => !["AWS_REGION", "S3_ASSETS_BUCKET"].includes(m));
  const error = errorKey ? errors[errorKey] ?? "Sign-in failed. Please try again." : undefined;

  return (
    <>
      {params.signedOut && (
        <p role="status" className="mb-4 rounded-xl bg-[#e7f4ea] px-4 py-3 font-sans text-sm font-semibold text-[#2f7a3d]">
          You have been signed out.
        </p>
      )}
      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-[#fde8e6] px-4 py-3 font-sans text-sm font-semibold text-burgundy">
          {error}
        </p>
      )}
      {missing.length > 0 ? (
        <div role="alert" className="rounded-xl border border-gold/50 bg-gold-pale/60 p-4 font-sans text-sm text-ink">
          <p className="font-semibold">Admin sign-in is not configured.</p>
          <p className="mt-1">Missing server environment variables:</p>
          <ul className="mt-1 list-disc pl-5 font-mono text-xs">
            {missing.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      ) : (
        <a
          href={`/admin/auth/login?next=${encodeURIComponent(next)}`}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-burgundy font-display text-[1.15rem] font-semibold text-ivory shadow-soft hover:bg-maroon-light"
        >
          <LockKeyhole aria-hidden="true" className="size-5" />
          Sign in securely
        </a>
      )}
    </>
  );
}

export default function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main id="main" className="hero-backdrop relative isolate grid min-h-dvh place-items-center overflow-hidden px-4 py-10">
      <Mandala className="pointer-events-none absolute -right-24 -top-24 -z-10 size-[360px] text-gold opacity-[0.14]" />
      <div className="w-full max-w-md rounded-3xl border border-gold/40 bg-ivory p-6 shadow-card sm:p-8">
        <div className="text-center">
          <Link href="/" className="font-display text-[2rem] font-bold text-burgundy">
            S.G.S King Foods
          </Link>
          <div aria-hidden="true" className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-gradient-to-r from-gold/0 to-gold" />
            <LeafSprig className="h-3.5 w-6 text-gold-deep" />
            <span className="h-px w-12 bg-gradient-to-l from-gold/0 to-gold" />
          </div>
          <h1 className="mt-3 flex items-center justify-center gap-2 font-display text-[1.5rem] font-semibold text-ink">
            <ShieldCheck aria-hidden="true" className="size-5 text-gold-deep" />
            Admin Sign In
          </h1>
          <p className="mt-1 font-sans text-sm text-umber">Restricted to authorised S.G.S King Foods staff.</p>
        </div>
        <div className="mt-6">
          <Suspense fallback={<div className="h-12 animate-pulse rounded-xl bg-gold-pale/70" />}>
            <LoginContent searchParams={searchParams} />
          </Suspense>
        </div>
        <div className="mt-6 border-t border-gold/25 pt-4 text-center font-sans text-sm text-umber">
          <p>Shopping with us? You don&rsquo;t need an account.</p>
          <Link href="/shop" className="mt-2 inline-flex min-h-11 items-center gap-2 font-semibold text-burgundy hover:underline">
            <ShoppingBag aria-hidden="true" className="size-4" />
            Continue to the shop
          </Link>
        </div>
      </div>
    </main>
  );
}
