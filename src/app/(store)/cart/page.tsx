import type { Metadata } from "next";

import { CartView } from "@/components/commerce/CartView";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review the items in your S.G.S King Foods cart.",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <PageHero compact title="Your Cart" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <section aria-label="Cart" className="heritage-paper">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <CartView />
        </div>
      </section>
    </>
  );
}
