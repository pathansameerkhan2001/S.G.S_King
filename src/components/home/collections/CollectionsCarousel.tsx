"use client";

import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { categories } from "@/content/categories";

import { CollectionCard } from "./CollectionCard";

/** Auto-scroll speed in px per second. */
const SPEED = 30;
/** How quickly speed eases toward its target (higher = snappier). */
const EASE_RATE = 3.5;
/** Pause after touch / wheel interaction before auto-scroll resumes (ms). */
const RESUME_DELAY = 1800;
/** Duration of the arrow-button glide (ms). */
const GLIDE_MS = 650;

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

type Glide = { from: number; to: number; start: number; duration: number };

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function CollectionsCarousel() {
  const reduceMotion = useReducedMotion() ?? false;
  const [userPaused, setUserPaused] = useState(false);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLUListElement | null)[]>([]);

  // Mutable animation state, kept in refs so the loop never triggers renders.
  const period = useRef(0); // width of one copy including the trailing gap
  const step = useRef(0); // width of one card including gap
  const pos = useRef(0);
  const lastWritten = useRef(-1);
  const glide = useRef<Glide | null>(null);
  const flags = useRef({ hover: false, touch: false, focus: false, inView: true, holdUntil: 0 });
  const runAllowed = useRef(true);

  useEffect(() => {
    runAllowed.current = !reduceMotion && !userPaused;
  }, [reduceMotion, userPaused]);

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

  // Measure copy width / card step, and start on the real (middle) copy.
  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const measure = () => {
      const [a, b] = copyRefs.current;
      if (!a || !b) return;
      const previousPeriod = period.current;
      period.current = b.offsetLeft - a.offsetLeft;
      const first = a.children[0] as HTMLElement | undefined;
      const second = a.children[1] as HTMLElement | undefined;
      step.current = first && second ? second.offsetLeft - first.offsetLeft : 0;

      // Preserve the relative position across resizes.
      const progress = previousPeriod ? (pos.current % previousPeriod) / previousPeriod : 0;
      pos.current = wrap(period.current + progress * period.current);
      glide.current = null;
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
        runAllowed.current && !f.hover && !f.touch && !f.focus && f.inView && now >= f.holdUntil;
      velocity += ((running ? SPEED : 0) - velocity) * Math.min(1, dt * EASE_RATE);

      const g = glide.current;
      if (g) {
        const t = g.duration ? Math.min(1, (now - g.start) / g.duration) : 1;
        pos.current = g.from + (g.to - g.from) * easeInOut(t);
        if (t >= 1) glide.current = null;
      } else if (velocity > 0.05) {
        pos.current += velocity * dt;
      } else {
        velocity = 0;
      }

      if (g || velocity > 0) {
        const wrapped = wrap(pos.current);
        const shift = wrapped - pos.current;
        if (shift && glide.current) {
          glide.current.from += shift;
          glide.current.to += shift;
        }
        pos.current = wrapped;
        writeScroll(el, pos.current);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Manual scrolling past either edge of the middle band: re-centre silently.
    const onScroll = () => {
      if (glide.current) return;
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
      glide.current = null;
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

  /** Glide one card left (-1) or right (+1). Instant for reduced motion. */
  const nudge = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el || !step.current) return;
    const from = glide.current ? glide.current.to : pos.current;
    if (reduceMotion) {
      pos.current = wrap(from + direction * step.current);
      writeScroll(el, pos.current);
      return;
    }
    glide.current = {
      from: pos.current,
      to: from + direction * step.current,
      start: performance.now(),
      duration: GLIDE_MS,
    };
  };

  const controlButton =
    "grid size-10 place-items-center rounded-full border border-gold/50 bg-ivory text-burgundy shadow-[0_6px_16px_-10px_rgba(101,10,22,0.5)] transition-colors duration-300 hover:border-burgundy hover:bg-burgundy hover:text-ivory sm:size-11";

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Our collections">
      <div
        ref={scrollerRef}
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

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-3 sm:mt-8">
        <button type="button" onClick={() => nudge(-1)} aria-label="Previous collections" className={controlButton}>
          <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </button>
        {/* Always rendered (the motion preference is unknown on the server, so
            conditional rendering would cause a hydration mismatch); hidden by
            CSS for reduced-motion users, who get no auto-scroll to pause. */}
        <button
          type="button"
          onClick={() => setUserPaused((v) => !v)}
          aria-pressed={userPaused}
          aria-label={userPaused ? "Play carousel" : "Pause carousel"}
          className={`${controlButton} size-9 motion-reduce:hidden sm:size-9`}
        >
          {userPaused ? (
            <Play aria-hidden="true" className="size-3.5 translate-x-px" strokeWidth={2} fill="currentColor" />
          ) : (
            <Pause aria-hidden="true" className="size-3.5" strokeWidth={2} fill="currentColor" />
          )}
        </button>
        <button type="button" onClick={() => nudge(1)} aria-label="Next collections" className={controlButton}>
          <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
