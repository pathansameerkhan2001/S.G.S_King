import { ImageIcon } from "lucide-react";
import Image from "next/image";

import type { CatalogItem } from "@/lib/catalog";

export function LineThumb({ item, size = "size-20 sm:size-24" }: { item: CatalogItem; size?: string }) {
  const image = item.images[0];
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-xl border border-gold/35 bg-cream ${size}`}>
      {image ? (
        <Image src={image.src} alt="" fill unoptimized={image.src.endsWith(".svg")} sizes="96px" className="object-cover" />
      ) : (
        <span className="grid size-full place-items-center text-gold-deep/60">
          <ImageIcon aria-hidden="true" className="size-6" strokeWidth={1.3} />
        </span>
      )}
    </span>
  );
}
