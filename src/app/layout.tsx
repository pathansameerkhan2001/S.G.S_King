import type { Metadata, Viewport } from "next";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { FloatingSocialBar } from "@/components/layout/FloatingSocialBar";
import { Footer } from "@/components/layout/footer/Footer";
import { Header } from "@/components/layout/Header";
import { MotionProvider } from "@/components/providers/MotionProvider";

import { crimson, manrope } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "S.G.S King | Premium Dry Fruits & Nuts from Kadapa, Rayalaseema",
    template: "%s | S.G.S King",
  },
  description:
    "A premium selection of handpicked dry fruits, nuts and seeds from Kadapa, Rayalaseema, packed with purity, freshness and natural nutrition. Pan India delivery.",
};

export const viewport: Viewport = {
  themeColor: "#650A16",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${crimson.variable} ${manrope.variable} antialiased`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-[100] rounded-lg bg-burgundy px-4 py-2 font-display text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to main content
        </a>
        <MotionProvider>
          <AnnouncementBar />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <FloatingSocialBar />
        </MotionProvider>
      </body>
    </html>
  );
}
