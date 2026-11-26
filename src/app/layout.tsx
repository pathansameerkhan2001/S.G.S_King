import type { Metadata, Viewport } from "next";

import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { FloatingSocialBar } from "@/components/layout/FloatingSocialBar";
import { FloatingSocialGate } from "@/components/layout/FloatingSocialGate";
import { Footer } from "@/components/layout/footer/Footer";
import { Header } from "@/components/layout/Header";
import { MotionProvider } from "@/components/providers/MotionProvider";

import { siteUrl } from "@/lib/site-url";

import { crimson, manrope } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "S.G.S King Foods",
  openGraph: {
    type: "website",
    siteName: "S.G.S King Foods",
    locale: "en_IN",
    images: [{ url: "/images/hero/hero-dry-fruits.jpg", alt: "S.G.S King Foods" }],
  },
  title: {
    default: "S.G.S King Foods | Traditional Sweets, Laddus & Foods from Kadapa, Rayalaseema",
    template: "%s | S.G.S King Foods",
  },
  description:
    "Traditional laddus, sweets & chikkis, honey, roasted nuts, masalas, instant mixes and millet powders from Kadapa, Rayalaseema. Handpicked, hygienically packed, with Pan India delivery.",
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
          <FloatingSocialGate>
            <FloatingSocialBar />
          </FloatingSocialGate>
        </MotionProvider>
      </body>
    </html>
  );
}
