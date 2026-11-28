import { Heart, MessageCircle, ShoppingCart, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "My Account",
  description: "Your S.G.S King Foods account.",
  robots: { index: false },
};

const links = [
  { href: "/cart", label: "Your Cart", text: "Review items and check out", icon: ShoppingCart },
  { href: "/wishlist", label: "Your Wishlist", text: "Products you have saved", icon: Heart },
  { href: "/contact", label: "Order Help", text: "Questions about an order? Contact us", icon: MessageCircle },
];

export default function AccountPage() {
  return (
    <>
      <PageHero compact title="My Account" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Account" }]} />
      <section aria-label="Account" className="heritage-paper">
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
          <div className="rounded-2xl border border-gold/35 bg-ivory p-6 text-center sm:p-8">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-gold-pale text-burgundy">
              <UserRound aria-hidden="true" className="size-8" strokeWidth={1.5} />
            </span>
            <h2 className="mt-4 font-display text-[1.8rem] font-bold text-burgundy">Customer accounts are coming soon</h2>
            <p className="mx-auto mt-2 max-w-md font-sans text-sm leading-relaxed text-umber">
              Sign-in, saved addresses and order history will be available here soon. Until then, your cart and wishlist are saved on this
              device.
            </p>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {links.map(({ href, label, text, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="flex h-full flex-col items-center gap-2 rounded-2xl border border-gold/30 bg-ivory p-5 text-center transition-colors hover:border-burgundy">
                  <Icon aria-hidden="true" className="size-6 text-gold-deep" strokeWidth={1.6} />
                  <span className="font-display text-[1.2rem] font-bold text-burgundy">{label}</span>
                  <span className="font-sans text-xs text-umber">{text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
