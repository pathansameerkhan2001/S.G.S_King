import type { Metadata } from "next";

import { CheckoutForm } from "@/components/commerce/CheckoutForm";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter your delivery details to prepare your S.G.S King Foods order.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        compact
        title="Checkout"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]}
      />
      <section aria-label="Checkout" className="heritage-paper">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <CheckoutForm />
        </div>
      </section>
    </>
  );
}
