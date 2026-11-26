"use client";

import { useEffect, type RefObject } from "react";

/**
 * Calls `onDismiss` when the user presses Escape or clicks/taps outside
 * every element in `refs` (the reason is passed through). Only active while `active` is true.
 */
export type DismissReason = "escape" | "outside";

export function useDismiss(
  active: boolean,
  refs: RefObject<HTMLElement | null>[],
  onDismiss: (reason: DismissReason) => void,
) {
  useEffect(() => {
    if (!active) return;

    const handlePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (refs.some((ref) => ref.current?.contains(target))) return;
      onDismiss("outside");
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss("escape");
    };

    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
    // refs are stable objects; onDismiss is expected to be stable or cheap.
  }, [active, refs, onDismiss]);
}
