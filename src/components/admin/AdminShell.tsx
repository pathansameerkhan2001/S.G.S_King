import { ExternalLink, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";

import type { AdminSession } from "@/lib/server/auth";

import { AdminMobileNav, AdminSidebarNav } from "./AdminNav";
import { AdminSearch } from "./AdminSearch";

/** Admin chrome: sidebar navigation, top bar (search, profile, logout). */
export function AdminShell({ session, children }: { session: AdminSession; children: ReactNode }) {
  const who = session.name ?? session.email ?? "Admin";
  return (
    <div className="min-h-dvh bg-[#fbf6ee] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-gold/25 bg-ivory lg:flex lg:h-dvh lg:flex-col lg:sticky lg:top-0">
        <div className="border-b border-gold/25 px-5 py-5">
          <Link href="/admin" className="block font-display text-[1.6rem] font-bold leading-none text-burgundy">
            S.G.S King
          </Link>
          <p className="mt-1 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-deep">Admin Panel</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <AdminSidebarNav />
        </div>
        <div className="border-t border-gold/25 p-3">
          <Link href="/" target="_blank" className="flex min-h-11 items-center gap-2 rounded-xl px-3 font-sans text-sm text-umber hover:bg-gold-pale hover:text-burgundy">
            <ExternalLink aria-hidden="true" className="size-4" />
            View storefront
            <span className="sr-only">(opens in a new tab)</span>
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-gold/25 bg-ivory/95 px-3 py-2.5 backdrop-blur sm:gap-3 sm:px-6">
          <div className="lg:hidden">
            <AdminMobileNav />
          </div>
          <Suspense fallback={<div className="flex-1" />}>
            <AdminSearch />
          </Suspense>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl px-2 sm:flex" title={session.email}>
              <span className="grid size-9 place-items-center rounded-full bg-gold-pale text-burgundy">
                <UserRound aria-hidden="true" className="size-[18px]" />
              </span>
              <span className="max-w-[180px] truncate font-sans text-sm font-semibold text-ink">{who}</span>
            </div>
            <form action="/admin/auth/logout" method="post">
              <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-xl border border-gold/45 px-3 font-sans text-sm font-semibold text-burgundy hover:bg-gold-pale">
                <LogOut aria-hidden="true" className="size-4" />
                <span className="hidden sm:inline">Sign out</span>
                <span className="sr-only sm:hidden">Sign out</span>
              </button>
            </form>
          </div>
        </header>
        <main id="main" className="px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
