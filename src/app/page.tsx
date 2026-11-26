import { BestSellersSection } from "@/components/home/best-sellers/BestSellersSection";
import { CollectionsSection } from "@/components/home/collections/CollectionsSection";
import { ComboProductsSection } from "@/components/home/combos/ComboProductsSection";
import { HeroSection } from "@/components/home/hero/HeroSection";
import { QualityTagsStrip } from "@/components/home/quality-tags/QualityTagsStrip";
import { SweetsSection } from "@/components/home/sweets/SweetsSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QualityTagsStrip />
      <CollectionsSection />
      <BestSellersSection />
      <ComboProductsSection />
      <SweetsSection />
    </>
  );
}
