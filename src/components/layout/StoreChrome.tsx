import type { ReactNode } from "react";

import { AnnouncementBar } from "./AnnouncementBar";
import { FloatingSocialBar } from "./FloatingSocialBar";
import { FloatingSocialGate } from "./FloatingSocialGate";
import { Footer } from "./footer/Footer";
import { Header } from "./Header";

/** Storefront chrome: announcement bar, header, main, footer and floating social bar. */
export function StoreChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <FloatingSocialGate>
        <FloatingSocialBar />
      </FloatingSocialGate>
    </>
  );
}
