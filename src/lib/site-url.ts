/**
 * Public site URL used for canonical links, Open Graph and the sitemap.
 * Set NEXT_PUBLIC_SITE_URL (e.g. https://www.example.com) in the deployment
 * environment; falls back to localhost for development.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
