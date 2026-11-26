"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

type QuickViewDialogProps = {
  open: boolean;
  onClose: () => void;
  /** id of the heading inside `children` that names the dialog. */
  labelledBy: string;
  children: ReactNode;
};

/**
 * Generic quick-view modal built on the native <dialog> element:
 * focus containment, Escape to close, backdrop click to close, page scroll
 * lock. Focus returns to the opener (callers may also restore it in onClose).
 */
export function QuickViewDialog({ open, onClose, labelledBy, children }: QuickViewDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      document.documentElement.style.overflow = "";
      onClose();
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="m-auto max-h-[90dvh] w-[min(92vw,820px)] overflow-hidden rounded-2xl border border-gold/40 bg-ivory p-0 text-ink shadow-card backdrop:bg-ink/50 backdrop:backdrop-blur-[2px] open:animate-[combo-dialog-in_0.28s_cubic-bezier(0.22,1,0.36,1)]"
    >
      {open && (
        <div className="relative max-h-[90dvh] overflow-y-auto">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close quick view"
            className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-ivory/90 text-ink shadow-sm transition-colors hover:bg-gold-pale hover:text-burgundy"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
          {children}
        </div>
      )}
    </dialog>
  );
}
