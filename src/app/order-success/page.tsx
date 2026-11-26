import type { Metadata } from "next";

import { OrderRequestView } from "@/components/commerce/OrderRequestView";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Order Request",
  description: "Your S.G.S King Foods order request summary.",
  robots: { index: false },
};

export default function OrderSuccessPage() {
  return (
    <>
      <PageHero compact title="Order Request" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Order Request" }]} />
      <section aria-label="Order request" className="heritage-paper">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <OrderRequestView />
        </div>
      </section>
    </>
  );
}
