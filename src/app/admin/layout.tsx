import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · S.G.S King Foods" },
  robots: { index: false, follow: false, nocache: true },
};

/** Admin area: no storefront chrome (header/footer live in app/(store)). */
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
