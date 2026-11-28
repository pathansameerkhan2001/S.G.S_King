import type { Metadata } from "next";

import { NotFoundContent } from "@/components/layout/NotFoundContent";

export const metadata: Metadata = { title: "Page Not Found", robots: { index: false } };

/** 404 for notFound() inside storefront routes (already inside the store layout). */
export default function NotFound() {
  return <NotFoundContent />;
}
