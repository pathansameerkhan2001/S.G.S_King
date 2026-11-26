# S.G.S King — Premium Dry Fruits

Ecommerce website for S.G.S King, Kadapa, Rayalaseema.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide.

```bash
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Structure

| Path | Purpose |
| --- | --- |
| `src/content/categories.ts` | **Single source of truth for product categories** (names, slugs, images, routes) |
| `src/content/site.ts` | Copy, navigation, routes and brand image paths |
| `src/app/globals.css` | Brand theme tokens (`bg-burgundy`, `text-gold`, `font-display`, …) |
| `src/app/fonts.ts` | Self-hosted fonts (Crimson Pro + Manrope via @fontsource) |
| `src/components/layout/` | AnnouncementBar, Header, DesktopNavigation, CategoryDropdown, MobileNavigation, SearchPanel, CartPreview, Logo |
| `src/components/home/hero/` | HeroSection, HeroContent, HeroImage, LocationBadge |
| `src/components/home/collections/` | CollectionsSection, CollectionsGrid, CollectionCard |
| `src/components/decor/Ornaments.tsx` | Heritage SVG line art (mandala, landscape, flourishes) |

## Assets to replace

Both images are **temporary crops from the design mockup**. Drop in the originals at the same paths
(and update the `width`/`height` in `src/content/site.ts` if they change):

- `public/images/brand/sgs-king-logo.png` — original logo, square, transparent, ≥ 400×400
- `public/images/hero/hero-dry-fruits.jpg` — hero photo, landscape ~4:3, ≥ 2000px wide
- `public/images/collections/*.svg` — **placeholder illustrations** for the 7 collections. Replace with
  product photos (5:4, ~1200×960) and update each category's `image` in `src/content/categories.ts`.

## Not yet connected

Routes `/shop`, `/categories/[slug]`, `/our-story`, `/contact`, `/account`, `/cart` do not exist yet.
Search submits `?q=` to `/shop`; the cart count is a prop (`<Header cartCount={…} />`) with no store behind it.
