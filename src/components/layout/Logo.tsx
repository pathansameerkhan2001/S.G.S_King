import Image from "next/image";
import Link from "next/link";

import { assets, brand } from "@/content/site";

type LogoProps = {
  className?: string;
  /** Rendered pixel hint for next/image `sizes`. */
  sizesHint?: string;
  preload?: boolean;
  onNavigate?: () => void;
};

/**
 * Brand logo. The image file lives at `assets.logo.src`
 * (public/images/brand/sgs-king-logo.png). Swap the file for the original
 * artwork; this component does not alter it.
 */
export function Logo({ className, sizesHint = "180px", preload, onNavigate }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${brand.name}, home`}
      onClick={onNavigate}
      className={`block rounded-full ${className ?? ""}`}
    >
      <Image
        src={assets.logo.src}
        width={assets.logo.width}
        height={assets.logo.height}
        alt={assets.logo.alt}
        sizes={sizesHint}
        preload={preload}
        className="size-full rounded-full object-contain drop-shadow-[0_8px_18px_rgba(101,10,22,0.18)]"
      />
    </Link>
  );
}
