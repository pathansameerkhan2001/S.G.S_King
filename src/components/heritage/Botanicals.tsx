import type { SVGProps } from "react";

/**
 * Original heritage motifs: golden sun rays and a mango-leaf sprig.
 * Decorative only (aria-hidden). Motion is CSS-only and motion-safe.
 */

/** Soft golden sunlight radiating from the top of a section. Glows in once, then stays still. */
export function SunRays({ className = "" }: { className?: string }) {
  const rays = Array.from({ length: 13 }, (_, i) => -72 + i * 12);
  return (
    <svg
      viewBox="-300 -40 600 340"
      aria-hidden="true"
      focusable={false}
      className={`motion-safe:animate-[sun-glow_2.4s_ease-out_both] ${className}`}
    >
      <defs>
        <linearGradient id="sun-ray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8cd96" stopOpacity="0.75" />
          <stop offset="1" stopColor="#e8cd96" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="sun-core" cx="50%" cy="0%" r="60%">
          <stop offset="0" stopColor="#fbefd2" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fbefd2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="0" cy="-40" rx="300" ry="200" fill="url(#sun-core)" />
      {rays.map((angle) => (
        <path key={angle} d="M-9 0 L9 0 L26 300 L-26 300 Z" fill="url(#sun-ray)" transform={`rotate(${angle})`} />
      ))}
    </svg>
  );
}

/** Mango-leaf sprig (line + soft fill), for section corners. Sways gently on desktop. */
export function MangoLeaves({ className = "", ...props }: SVGProps<SVGSVGElement>) {
  const leaf = "M0 0 C 18 -14 52 -16 82 0 C 52 16 18 14 0 0 Z";
  const leaves = [
    { x: 30, y: 40, r: -32, s: 1.05 },
    { x: 52, y: 70, r: -8, s: 1.15 },
    { x: 46, y: 106, r: 18, s: 1 },
    { x: 70, y: 132, r: 38, s: 0.9 },
    { x: 20, y: 96, r: -58, s: 0.85 },
  ];
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      focusable={false}
      className={`origin-top-left motion-safe:[@media(hover:hover)_and_(min-width:768px)]:animate-[leaf-sway_9s_ease-in-out_infinite] ${className}`}
      {...props}
    >
      <path d="M8 10 C 40 50 52 100 96 160" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {leaves.map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`}>
          <path d={leaf} fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.2" />
          <path d="M4 0 H76" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.7" />
          {[18, 34, 50, 64].map((x) => (
            <path key={x} d={`M${x} 0 l9 -6 M${x} 0 l9 6`} stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.5" />
          ))}
        </g>
      ))}
    </svg>
  );
}
