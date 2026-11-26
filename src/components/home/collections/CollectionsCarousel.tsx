"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import { categories } from "@/content/categories";

import { CollectionCard } from "./CollectionCard";

/** Auto-scroll speed in px per second. */
const SPEED = 30;
/** How quickly speed eases toward its target (higher = snappier). */
const EASE_RATE = 3.5;
/** Pause after touch / wheel interaction before auto-scroll resumes (ms). */
const RESUME_DELAY = 1800;

/**
 * The track renders the category list three times. Copy 1 (the middle) is
 * the real, accessible list; copies 0 and 2 are visual clones (aria-hidden +
 * inert) so the loop never shows a gap. Category data is never duplicated.
 */
const COPIES = [0, 1, 2] as const;
const REAL_COPY = 1;

const itemWidth =
  "w-[clamp(150px,44vw,196px)] sm:w-[220px] md:w-[236px] lg:w-[260px] xl:w-[280px]";
const gap = "gap-3 sm:gap-5 xl:gap-7";

/**
 * Continuously auto-scrolling, seamlessly looping row of collection cards.
 * Pauses on hover, touch, keyboard focus and when off-screen; supports native
 * swipe / trackpad scrolling; no auto-movement for reduced-motion users.
 */
export function CollectionsCarousel() {
  const reduceMotion = useReducedMotion() ?? false;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLUListElement | null)[]>([]);

  // Mutable animation state, kept in refs so the loop never triggers renders.
  const period = useRef(0); // width of one copy including the trailing gap
  const pos = useRef(0);
  const lastWritten = useRef(-1);
  const flags = useRef({ hover: false, touch: false, focus: false, inView: true, holdUntil: 0 });
  const autoplay = useRef(true);

  useEffect(() => {
    autoplay.current = !reduceMotion;
  }, [reduceMotion]);

  /** Keep the scroll position inside the middle band so both directions loop. */
  const wrap = useCallback((value: number) => {
    const p = period.current;
    if (!p) return value;
    let v = value;
    while (v < p * 0.5) v += p;
    while (v >= p * 1.5) v -= p;
    return v;
  }, []);

  const writeScroll = useCallback((el: HTMLDivElement, value: number) => {
    el.scrollLeft = value;
    lastWritten.current = el.scrollLeft;
  }, []);

  // Measure one copy's width and start on the real (middle) copy.
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const measure = () => {
      const [a, b] = copyRefs.current;
      if (!a || !b) return;
      const previousPeriod = period.current;
      period.current = b.offsetLeft - a.offsetLeft;
      // Preserve the relative position across resizes.
      const progress = previousPeriod ? (pos.current % previousPeriod) / previousPeriod : 0;
      pos.current = wrap(period.current + progress * period.current);
      writeScroll(el, pos.current);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (copyRefs.current[0]) observer.observe(copyRefs.current[0]);
    return () => observer.disconnect();
  }, [wrap, writeScroll]);

  // Animation loop + interaction listeners.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const f = flags.current;

    let raf = 0;
    let last = performance.now();
    let velocity = 0;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;

      // Native scrolling (swipe, wheel, focus) moved the track: follow it.
      if (Math.abs(el.scrollLeft - lastWritten.current) > 1.5) {
        pos.current = el.scrollLeft;
        lastWritten.current = el.scrollLeft;
      }

      const running =
        autoplay.current && !f.hover && !f.touch && !f.focus && f.inView && now >= f.holdUntil;
      velocity += ((running ? SPEED : 0) - velocity) * Math.min(1, dt * EASE_RATE);

      if (velocity > 0.05) {
        pos.current = wrap(pos.current + velocity * dt);
        writeScroll(el, pos.current);
      } else {
        velocity = 0;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Manual scrolling past either edge of the middle band: re-centre silently.
    const onScroll = () => {
      const wrapped = wrap(el.scrollLeft);
      if (Math.abs(wrapped - el.scrollLeft) > 1) {
        pos.current = wrapped;
        writeScroll(el, wrapped);
      }
    };
    const hold = () => {
      f.holdUntil = performance.now() + RESUME_DELAY;
    };
    const onTouchStart = () => {
      f.touch = true;
    };
    const onTouchEnd = () => {
      f.touch = false;
      hold();
    };
    const onPointerEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") f.hover = true;
    };
    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") f.hover = false;
    };
    const onFocusIn = () => {
      f.focus = true;
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!el.contains(e.relatedTarget as Node | null)) f.focus = false;
    };

    const io = new IntersectionObserver(([entry]) => {
      f.inView = entry.isIntersecting;
    });
    io.observe(el);

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", hold, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });
    el.addEventListener("pointerenter", onPointerEnter);
    el.addEventListener("pointerleave", onPointerLeave);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", hold);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
      el.removeEventListener("pointerenter", onPointerEnter);
      el.removeEventListener("pointerleave", onPointerLeave);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
    };
  }, [wrap, writeScroll]);

  return (
    <div
      ref={scrollerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Our collections"
      className={[
        "overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        // soft fade at both edges
        "[mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]",
        "sm:[mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)]",
      ].join(" ")}
    >
      {/* py leaves room for the card hover lift and shadow */}
      <div className={`flex w-max py-4 ${gap}`}>
        {COPIES.map((copy) => {
          const isClone = copy !== REAL_COPY;
          return (
            <ul
              key={copy}
              ref={(node) => {
                copyRefs.current[copy] = node;
              }}
              aria-hidden={isClone || undefined}
              inert={isClone}
              aria-label={isClone ? undefined : "Collections"}
              className={`flex shrink-0 ${gap}`}
            >
              {categories.map((category) => (
                <li key={category.slug} className={`shrink-0 ${itemWidth}`}>
                  <CollectionCard category={category} />
                </li>
              ))}
            </ul>
          );
        })}
      </div>
    </div>
  );
}
