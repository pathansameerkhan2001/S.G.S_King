import type { Metadata } from "next";

import { WishlistView } from "@/components/commerce/WishlistView";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Your Wishlist",
  description: "Products you have saved at S.G.S King Foods.",
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <>
      <PageHero compact title="Your Wishlist" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <section aria-label="Wishlist" className="heritage-paper">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <WishlistView />
        </div>
      </section>
    </>
  );
}
