import type { MetadataRoute } from "next";

import { categories, categoryHref } from "@/content/categories";
import { policies } from "@/content/policies";
import { catalog } from "@/lib/catalog";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/shop", "/about", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${siteUrl}${p}`, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.8 })),
    ...categories.map((c) => ({ url: `${siteUrl}${categoryHref(c.slug)}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...catalog.map((i) => ({ url: `${siteUrl}${i.href}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...policies.filter((p) => p.status === "approved").map((p) => ({ url: `${siteUrl}/policies/${p.slug}`, priority: 0.3 })),
  ];
}
