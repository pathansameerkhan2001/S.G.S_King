"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * Wraps line-art SVG so its strokes draw in when scrolled into view.
 * Server HTML shows the art fully drawn (no-JS safe); on mount, art that is
 * off-screen is hidden and drawn when it enters the viewport.
 */
export function DrawOnView({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // Already visible on load: draw from the start.
      el.dataset.draw = "pending";
      requestAnimationFrame(() => requestAnimationFrame(() => (el.dataset.draw = "drawn")));
      return;
    }
    el.dataset.draw = "pending";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.draw = "drawn";
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      {children}
    </div>
  );
}
