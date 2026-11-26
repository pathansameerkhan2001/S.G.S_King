import type { SVGProps } from "react";

/** Small decorative gold crown (purely visual). */
export function Crown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 40" fill="none" aria-hidden="true" focusable={false} {...props}>
      <path
        d="M8 30 4 10l14 10L32 4l14 16 14-10-4 20Z"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M8 30h48v6H8Z" fill="currentColor" />
      <circle cx="4" cy="9" r="2.6" fill="currentColor" />
      <circle cx="32" cy="3.5" r="3" fill="currentColor" />
      <circle cx="60" cy="9" r="2.6" fill="currentColor" />
      <path d="M32 15 35 20 32 25 29 20Z" fill="currentColor" />
      <circle cx="18" cy="24" r="1.8" fill="currentColor" />
      <circle cx="46" cy="24" r="1.8" fill="currentColor" />
    </svg>
  );
}
