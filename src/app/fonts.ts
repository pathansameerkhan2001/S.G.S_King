import localFont from "next/font/local";

/**
 * Fonts are self-hosted from @fontsource packages so the build never
 * depends on reaching Google Fonts.
 *
 * - Crimson Pro: editorial serif for headings, navigation and CTAs.
 * - Manrope: clean sans-serif for small UI text.
 */
export const crimson = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource-variable/crimson-pro/files/crimson-pro-latin-wght-normal.woff2",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource-variable/crimson-pro/files/crimson-pro-latin-wght-italic.woff2",
      weight: "200 900",
      style: "italic",
    },
  ],
  variable: "--font-crimson",
  display: "swap",
});

export const manrope = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
});
