"use client";

import { Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { brand } from "@/content/site";
import { shareOrCopy, type ShareResult } from "@/lib/share";

import { cornerButton } from "./styles";

type ShareProductButtonProps = {
  productName: string;
  /** Site-relative product path, e.g. "/products/peanut-chikki". */
  path: string;
  /** Receives a short status message to show (or null to clear). */
  onStatus: (message: string | null) => void;
};

const messages: Partial<Record<ShareResult, string>> = {
  copied: "Link copied",
  failed: "Couldn’t share. Please try again.",
};

/**
 * Shares the product via the Web Share API, falling back to copying the
 * product link. Cancelling the native share sheet shows nothing.
 */
export function ShareProductButton({ productName, path, onStatus }: ShareProductButtonProps) {
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const share = async () => {
    if (busy) return;
    setBusy(true);
    const result = await shareOrCopy({
      title: `${productName} | ${brand.name}`,
      text: `${productName} from ${brand.name}, ${brand.location}`,
      url: new URL(path, window.location.origin).toString(),
    });
    setBusy(false);

    const message = messages[result] ?? null;
    onStatus(message);
    if (timer.current) clearTimeout(timer.current);
    if (message) timer.current = setTimeout(() => onStatus(null), 2200);
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label={`Share ${productName}`}
      aria-busy={busy || undefined}
      className={cornerButton}
    >
      <Share2 aria-hidden="true" className="size-[17px]" strokeWidth={1.8} />
    </button>
  );
}
