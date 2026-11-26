import type { SVGProps } from "react";

/**
 * Decorative, heritage-inspired line art. Every ornament here is purely
 * visual: aria-hidden and non-focusable.
 */

type OrnamentProps = SVGProps<SVGSVGElement>;

const decorative = { "aria-hidden": true, focusable: false } as const;

/** Small gold flourish used at both ends of the announcement bar. */
export function GoldFlourish(props: OrnamentProps) {
  return (
    <svg viewBox="0 0 64 14" fill="none" {...decorative} {...props}>
      <path d="M1 7h19M44 7h19" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path
        d="M20 7c3-5 7-5 8.5-1.5M44 7c-3-5-7-5-8.5-1.5M20 7c3 5 7 5 8.5 1.5M44 7c-3 5-7 5-8.5 1.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="M32 2.5 36.5 7 32 11.5 27.5 7Z" fill="currentColor" />
      <circle cx="5" cy="7" r="1.4" fill="currentColor" />
      <circle cx="59" cy="7" r="1.4" fill="currentColor" />
    </svg>
  );
}

/** Lotus-like leaf sprig used inside the hero eyebrow badge. */
export function LeafSprig(props: OrnamentProps) {
  return (
    <svg viewBox="0 0 28 18" fill="currentColor" {...decorative} {...props}>
      <path d="M14 17C13.5 10.5 9 5.2 1.5 4c.3 7 5 12.2 12.5 13Z" />
      <path d="M14 17c.5-6.5 5-11.8 12.5-13-.3 7-5 12.2-12.5 13Z" />
      <path d="M14 16.5c-2.4-3.8-2.4-9 0-14 2.4 5 2.4 10.2 0 14Z" opacity="0.85" />
    </svg>
  );
}

/** Tapered brush-stroke underline drawn beneath the hero heading. */
export function CurvedUnderline(props: OrnamentProps) {
  return (
    <svg viewBox="0 0 320 26" fill="currentColor" preserveAspectRatio="none" {...decorative} {...props}>
      <path d="M2 23.5C62 9.5 176 1.5 318 3.2c.9 0 1 1.3.1 1.4C190 9 84 16.2 6.5 25.6 2.4 26.1.4 24 2 23.5Z" />
    </svg>
  );
}

/** Fine-line mandala; shown partially at the hero's top-left edge. */
export function Mandala(props: OrnamentProps) {
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const smallPetals = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <svg viewBox="-100 -100 200 200" fill="none" stroke="currentColor" {...decorative} {...props}>
      <circle r="97" strokeWidth="0.6" />
      <circle r="92" strokeWidth="0.4" strokeDasharray="1.5 2.5" />
      {petals.map((angle) => (
        <path
          key={`outer-${angle}`}
          d="M0-58C9-68 9-80 0-90-9-80-9-68 0-58Z"
          strokeWidth="0.7"
          transform={`rotate(${angle})`}
        />
      ))}
      {petals.map((angle) => (
        <path
          key={`inner-line-${angle}`}
          d="M0-62V-84"
          strokeWidth="0.4"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle r="56" strokeWidth="0.6" />
      {smallPetals.map((angle) => (
        <path
          key={`mid-${angle}`}
          d="M0-30C6-37 6-46 0-54-6-46-6-37 0-30Z"
          strokeWidth="0.55"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle r="28" strokeWidth="0.6" />
      <circle r="20" strokeWidth="0.4" strokeDasharray="1 2" />
      {petals.map((angle) => (
        <path
          key={`core-${angle}`}
          d="M0-6C3-10 3-14 0-18-3-14-3-10 0-6Z"
          strokeWidth="0.5"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle r="4" strokeWidth="0.6" />
    </svg>
  );
}

/** Builds a crenellated wall top (battlements) between two x positions. */
function battlements(x1: number, x2: number, baseY: number, height: number, merlon: number) {
  let d = `M${x1} ${baseY}`;
  let x = x1;
  let up = true;
  while (x < x2) {
    const next = Math.min(x + merlon, x2);
    d += up ? ` V${baseY - height} H${next}` : ` V${baseY} H${next}`;
    up = !up;
    x = next;
  }
  return `${d} V${baseY}`;
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-14M0-8l-4-4M0-10l4-3" strokeWidth="0.9" />
      <path
        d="M-9-15c-3-5 1-10 6-9 1-5 9-5 10 0 5-1 8 4 5 8 2 4-2 7-6 5-3 3-8 3-10 0-4 1-7-1-5-4Z"
        strokeWidth="0.9"
      />
    </g>
  );
}

/**
 * Sepia sketch of the Rayalaseema landscape: a hill-top fort (inspired by
 * Gandikota in Kadapa district), a flat-topped mesa, scrub trees and
 * the plains. Low opacity, decorative only.
 */
export function HeritageLandscape(props: OrnamentProps) {
  const wallTop = battlements(150, 300, 78, 5, 6);
  const towerTop = battlements(205, 240, 50, 5, 5);
  const tower2Top = battlements(272, 292, 64, 4, 4);
  return (
    <svg
      viewBox="0 0 820 210"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      preserveAspectRatio="xMinYMax meet"
      {...decorative}
      {...props}
    >
      {/* Ground / plains */}
      <path d="M0 196C140 192 300 198 460 194S700 190 820 196" strokeWidth="1" />
      <path d="M30 204c90-3 200 2 330-1M420 203c110-3 230 1 360-2" strokeWidth="0.6" opacity="0.7" />

      {/* Fort hill */}
      <path
        d="M0 160C40 140 80 112 128 96c26-8 54-10 86-10 44 0 74 6 102 22 34 20 64 50 108 74 26 14 52 20 76 24"
        strokeWidth="1.1"
      />
      {/* Hill shading strokes */}
      <path
        d="M40 150c14-6 26-14 38-22M70 156c18-10 32-20 48-34M110 160c12-12 26-24 42-34M310 126c18 14 32 30 52 46M340 128c14 16 30 32 52 48M260 116c16 12 26 26 36 42M180 104c-8 14-16 28-28 44"
        strokeWidth="0.6"
        opacity="0.75"
      />

      {/* Fort walls */}
      <path d={wallTop} strokeWidth="0.9" />
      <path d="M150 78V94M300 78V102" strokeWidth="0.9" />
      <path d="M160 84h20M190 86h14M250 84h22M280 88h12" strokeWidth="0.6" />
      {/* Main tower */}
      <path d="M208 78V50h29v28" strokeWidth="0.9" />
      <path d={towerTop} strokeWidth="0.9" />
      <path d="M219 78v-10a3.5 3.5 0 0 1 7 0v10" strokeWidth="0.8" />
      <path d="M214 58h3M228 58h3" strokeWidth="0.8" />
      {/* Secondary tower */}
      <path d="M274 78V64h17v14" strokeWidth="0.9" />
      <path d={tower2Top} strokeWidth="0.9" />
      {/* Bastion on the left */}
      <path d="M162 78V68c0-4 12-4 12 0v10" strokeWidth="0.8" />

      {/* Mesa / flat-topped hill */}
      <path
        d="M430 194c26-24 52-50 80-70 18-12 32-18 46-22l10-14h92l14 12c22 8 40 24 60 44 24 24 50 40 88 52"
        strokeWidth="1.1"
      />
      <path d="M566 88c20 3 44 3 74-1" strokeWidth="0.7" />
      <path
        d="M560 104l-14 34M582 102l-10 40M606 102l-6 44M632 102l2 42M656 104l10 36M680 112l16 30M520 130l-18 26M708 128l20 22"
        strokeWidth="0.55"
        opacity="0.7"
      />

      {/* Trees along the plains */}
      <Tree x={22} y={194} s={1.5} />
      <Tree x={60} y={196} s={1.1} />
      <Tree x={372} y={194} s={1.2} />
      <Tree x={408} y={195} s={0.9} />
      <Tree x={480} y={193} s={1.3} />
      <Tree x={720} y={194} s={1} />
      <Tree x={770} y={196} s={1.25} />

      {/* Birds */}
      <path d="M330 40q5-4 9 0 4-4 9 0M356 30q4-3 7 0 3-3 7 0M470 56q4-3 7 0 3-3 7 0" strokeWidth="0.8" />
    </svg>
  );
}
