import type { Metadata } from "next";

import { NotFoundContent } from "@/components/layout/NotFoundContent";
import { StoreChrome } from "@/components/layout/StoreChrome";

export const metadata: Metadata = { title: "Page Not Found", robots: { index: false } };

/** Global 404 for unmatched URLs (outside any route group), with storefront chrome. */
export default function NotFound() {
  return (
    <StoreChrome>
      <NotFoundContent />
    </StoreChrome>
  );
}
