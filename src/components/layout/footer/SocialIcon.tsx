import type { SVGProps } from "react";

import { InstagramIcon, WhatsAppIcon } from "@/components/icons/BrandIcons";

import type { SocialAccount } from "@/content/contact";

/** Outline fallbacks for accounts without an official glyph embedded yet. */
function FacebookGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15Z" />
    </svg>
  );
}

function YoutubeGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9 5 3-5 3Z" fill="currentColor" />
    </svg>
  );
}

export function SocialIcon({ id, className }: { id: SocialAccount["id"] | "whatsapp"; className?: string }) {
  const props = { className, "aria-hidden": true } as const;
  switch (id) {
    case "instagram":
      return <InstagramIcon {...props} />;
    case "facebook":
      return <FacebookGlyph {...props} />;
    case "youtube":
      return <YoutubeGlyph {...props} />;
    case "whatsapp":
      return <WhatsAppIcon {...props} />;
  }
}
