"use client";

import { Check, Gift, ImageIcon, Minus, Package, Plus, ShoppingBag, ZoomIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductPrice } from "@/components/product/ProductPrice";
import { QuickViewDialog } from "@/components/product/QuickViewDialog";
import { ShareProductButton } from "@/components/product/ShareProductButton";
import { WishlistButton } from "@/components/product/WishlistButton";
import { commerce } from "@/content/commerce";
import { business, whatsappHref } from "@/content/contact";
import { addToCart } from "@/lib/cart/store";
import {
  categoryHref,
  categoryName,
  getItemByKey,
  getVariant,
  productsInCombo,
  relatedItems,
  type CatalogItem,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { recordView, useRecentlyViewed } from "@/lib/history";
import { siteUrl } from "@/lib/site-url";

import { CatalogGrid } from "./CatalogGrid";

const stockLabel = {
  in_stock: { text: "In stock", className: "text-[#2f7a3d]" },
  low_stock: { text: "Only a few left", className: "text-[#b45309]" },
  out_of_stock: { text: "Out of stock", className: "text-burgundy" },
} as const;

function Gallery({ item }: { item: CatalogItem }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const image = item.images[index];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-gold/35 bg-gradient-to-b from-gold-pale/60 to-cream shadow-[0_18px_40px_-28px_rgba(53,23,15,0.55)]">
        {image ? (
          <>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              preload
              unoptimized={image.src.endsWith(".svg")}
              sizes="(min-width: 1024px) 560px, 100vw"
              className={image.fit === "contain" ? "object-contain p-6" : "object-cover"}
            />
            <button
              type="button"
              onClick={() => setZoom(true)}
              aria-label="Enlarge image"
              className="absolute bottom-3 right-3 grid size-11 place-items-center rounded-full border border-gold/40 bg-ivory/90 text-burgundy shadow-sm transition-colors hover:bg-burgundy hover:text-ivory"
            >
              <ZoomIn aria-hidden="true" className="size-5" />
            </button>
          </>
        ) : (
          <span className="flex size-full flex-col items-center justify-center gap-2 text-gold-deep/60">
            {item.kind === "combo" ? <Gift className="size-12" strokeWidth={1.2} /> : <ImageIcon className="size-12" strokeWidth={1.2} />}
            <span className="font-sans text-xs uppercase tracking-[0.2em]">Image coming soon</span>
          </span>
        )}
        {item.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-burgundy px-3 py-1 font-sans text-[0.65rem] font-bold uppercase tracking-[0.12em] text-ivory">
            {item.badge}
          </span>
        )}
      </div>

      {item.images.length > 1 && (
        <ul aria-label="Product images" className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {item.images.map((img, i) => (
            <li key={img.src + i}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index}
                className={`relative block size-16 overflow-hidden rounded-lg border-2 sm:size-20 ${i === index ? "border-burgundy" : "border-gold/30"}`}
              >
                <Image src={img.src} alt="" fill unoptimized={img.src.endsWith(".svg")} sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <QuickViewDialog open={zoom} onClose={() => setZoom(false)} labelledBy="zoom-title">
        <h2 id="zoom-title" className="sr-only">
          {item.name}: enlarged image
        </h2>
        {image && (
          <div className="relative aspect-square w-full">
            <Image src={image.src} alt={image.alt} fill unoptimized={image.src.endsWith(".svg")} sizes="820px" className="object-contain" />
          </div>
        )}
      </QuickViewDialog>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-gold/30 bg-ivory p-5 sm:p-6">
      <h2 className="font-display text-[1.4rem] font-bold text-burgundy">{title}</h2>
      <div className="mt-2 font-sans text-[0.92rem] leading-relaxed text-ink/85">{children}</div>
    </section>
  );
}

export function ItemDetailView({ itemKey }: { itemKey: string }) {
  const router = useRouter();
  const item = getItemByKey(itemKey)!;
  const [variantId, setVariantId] = useState(item.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const variant = getVariant(item, variantId);
  const savings = variant.mrp && variant.mrp > variant.price ? variant.mrp - variant.price : 0;
  const soldOut = item.availability === "out_of_stock" || variant.stock === 0;
  const stock = soldOut ? stockLabel.out_of_stock : stockLabel[item.availability];

  useEffect(() => recordView(item.key), [item.key]);

  const recentKeys = useRecentlyViewed();
  const recent = useMemo(
    () => recentKeys.filter((k) => k !== item.key).map(getItemByKey).filter((x): x is CatalogItem => !!x).slice(0, 4),
    [recentKeys, item.key],
  );
  const related = useMemo(() => relatedItems(item, 4), [item]);
  const together = useMemo(() => (item.kind === "combo" ? productsInCombo(item).slice(0, 4) : []), [item]);

  // Mobile sticky bar: shown only while the main purchase buttons are off-screen.
  const actionsRef = useRef<HTMLDivElement>(null);
  const [actionsVisible, setActionsVisible] = useState(true);
  useEffect(() => {
    const el = actionsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActionsVisible(entry.isIntersecting || entry.boundingClientRect.top > 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const whatsappOrder = whatsappHref(
    business.whatsapp,
    `Hello S.G.S King Foods, I would like to order:
${item.name} (${variant.label}) × ${quantity} = ${formatPrice(variant.price * quantity)}
${siteUrl}${item.href}`,
  );

  const buyNow = () => {
    if (addToCart(item.key, variant.id, quantity)) router.push("/checkout");
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <Gallery item={item} />

        <div className="flex flex-col gap-4">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">
            {item.kind === "combo" ? (
              "Combo Pack"
            ) : item.categorySlug ? (
              <Link href={categoryHref(item.categorySlug)} className="hover:text-burgundy hover:underline">
                {categoryName(item.categorySlug)}
              </Link>
            ) : null}
          </p>
          <h1 id="page-title" className="-mt-2 font-display text-[2.2rem] font-bold leading-tight text-burgundy sm:text-[2.8rem]">
            {item.name}
          </h1>
          {item.description && <p className="font-display text-[1.15rem] leading-relaxed text-ink/85">{item.description}</p>}

          <div className="rounded-2xl border border-gold/30 bg-ivory/80 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <ProductPrice product={variant} />
            </div>
            {savings > 0 && (
              <p className="mt-1.5 font-sans text-sm font-semibold text-[#2f7a3d]">You save {formatPrice(savings)}</p>
            )}
            <p className="mt-1 font-sans text-xs text-umber">{commerce.deliveryNote}</p>
          </div>

          {/* Size */}
          <fieldset>
            <legend className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-umber">
              {item.kind === "combo" ? "Pack size" : item.variants.length > 1 ? "Choose size" : "Size"}
            </legend>
            <div role="radiogroup" aria-label="Size" className="mt-2 flex flex-wrap gap-2">
              {item.variants.map((v) => {
                const checked = v.id === variant.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    onClick={() => setVariantId(v.id)}
                    className={`min-h-11 rounded-xl border px-4 font-sans text-sm font-semibold transition-colors ${
                      checked ? "border-burgundy bg-burgundy text-ivory" : "border-gold/50 bg-ivory text-umber hover:border-burgundy"
                    }`}
                  >
                    {v.label}
                    <span className="ml-1.5 font-normal opacity-80">{formatPrice(v.price)}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <p className={`font-sans text-sm font-semibold ${stock.className}`}>
            <span className="mr-1.5 inline-block size-2 rounded-full bg-current align-middle" aria-hidden="true" />
            {stock.text}
            {typeof variant.stock === "number" && variant.stock > 0 && variant.stock <= 10 ? ` (${variant.stock} available)` : ""}
          </p>

          {/* Quantity + actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 items-center rounded-xl border border-gold/50 bg-ivory" role="group" aria-label="Quantity">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="grid size-12 place-items-center text-burgundy disabled:opacity-40"
              >
                <Minus aria-hidden="true" className="size-4" />
              </button>
              <output aria-live="polite" className="w-10 text-center font-sans text-base font-semibold">
                {quantity}
              </output>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(commerce.maxQuantity, q + 1))}
                disabled={quantity >= commerce.maxQuantity}
                aria-label="Increase quantity"
                className="grid size-12 place-items-center text-burgundy disabled:opacity-40"
              >
                <Plus aria-hidden="true" className="size-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <WishlistButton
                itemKey={item.key}
                productName={item.name}
                className="grid size-12 place-items-center rounded-xl border border-gold/50 bg-ivory text-burgundy transition-colors hover:border-burgundy hover:bg-burgundy hover:text-ivory"
              />
              <div className="[&>button]:size-12 [&>button]:rounded-xl">
                <ShareProductButton productName={item.name} path={item.href} onStatus={setShareStatus} />
              </div>
            </div>
          </div>
          <p role="status" aria-live="polite" className="-mt-2 min-h-5 font-sans text-xs font-semibold text-burgundy">
            {shareStatus}
          </p>

          {soldOut ? (
            <p className="rounded-xl bg-umber/15 py-3 text-center font-display text-lg font-semibold text-umber">Currently out of stock</p>
          ) : (
            <div ref={actionsRef} className="grid gap-3 sm:grid-cols-2">
              <AddToCartButton itemKey={item.key} variantId={variant.id} quantity={quantity} name={`${item.name} (${variant.label})`} className="h-13! sm:h-13! text-[1.15rem]! sm:text-[1.15rem]!" />
              <button
                type="button"
                onClick={buyNow}
                className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border-[1.5px] border-burgundy bg-ivory font-display text-[1.15rem] font-semibold text-burgundy transition-colors hover:bg-gold-pale"
              >
                <ShoppingBag aria-hidden="true" className="size-5" />
                Buy Now
              </button>
              <a
                href={whatsappOrder}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] font-display text-[1.08rem] font-semibold text-white transition-[filter] hover:brightness-105 sm:col-span-2"
              >
                <WhatsAppIcon className="size-5" />
                Order on WhatsApp
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          )}

          <ul className="mt-1 grid gap-2 font-sans text-[0.85rem] text-umber sm:grid-cols-2">
            {["Handpicked & hygienically packed", "Pan India delivery", "From Kadapa, Rayalaseema", "Support on WhatsApp & phone"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check aria-hidden="true" className="size-4 shrink-0 text-gold-deep" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Details */}
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {item.includedItems && item.includedItems.length > 0 && (
          <InfoBlock title="What's Included">
            <ul className="divide-y divide-gold/20">
              {item.includedItems.map((x) => (
                <li key={x.name} className="flex items-center gap-3 py-2.5">
                  <Package aria-hidden="true" className="size-4 shrink-0 text-gold-deep" />
                  <span className="flex-1 font-display text-[1.08rem] text-ink">{x.name}</span>
                  {x.quantity && <span className="font-semibold text-umber">{x.quantity}</span>}
                </li>
              ))}
            </ul>
            {item.packSize && <p className="mt-3 font-semibold text-burgundy">Total pack size: {item.packSize}</p>}
          </InfoBlock>
        )}

        <InfoBlock title="Product Details">
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
            <dt className="font-semibold text-umber">Type</dt>
            <dd>{item.kind === "combo" ? "Combo pack" : categoryName(item.categorySlug)}</dd>
            <dt className="font-semibold text-umber">{item.kind === "combo" ? "Pack size" : "Sizes"}</dt>
            <dd>{item.variants.map((v) => v.label).join(", ")}</dd>
            <dt className="font-semibold text-umber">Origin</dt>
            <dd>Kadapa, Rayalaseema, Andhra Pradesh</dd>
          </dl>
        </InfoBlock>

        {item.ingredients && item.ingredients.length > 0 && (
          <InfoBlock title="Ingredients">
            <p>{item.ingredients.join(", ")}</p>
          </InfoBlock>
        )}
        {item.storage && (
          <InfoBlock title="Storage">
            <p>{item.storage}</p>
          </InfoBlock>
        )}
        {item.nutrition && item.nutrition.length > 0 && (
          <InfoBlock title="Nutrition Information">
            <dl className="grid grid-cols-[1fr_auto] gap-y-1.5">
              {item.nutrition.map((n) => (
                <div key={n.label} className="contents">
                  <dt>{n.label}</dt>
                  <dd className="text-right font-semibold">{n.value}</dd>
                </div>
              ))}
            </dl>
          </InfoBlock>
        )}
        {item.faqs && item.faqs.length > 0 && (
          <InfoBlock title="Frequently Asked Questions">
            <div className="divide-y divide-gold/20">
              {item.faqs.map((f) => (
                <details key={f.question} className="group py-2.5">
                  <summary className="cursor-pointer list-none font-semibold text-ink marker:hidden">{f.question}</summary>
                  <p className="mt-1.5">{f.answer}</p>
                </details>
              ))}
            </div>
          </InfoBlock>
        )}
      </div>

      {together.length > 0 && (
        <section aria-labelledby="together-heading" className="mt-14">
          <h2 id="together-heading" className="font-display text-[1.9rem] font-bold text-burgundy">
            Frequently Bought Together
          </h2>
          <p className="mt-1 font-sans text-sm text-umber">Individual products from this combo.</p>
          <div className="mt-5">
            <CatalogGrid items={together} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-14">
          <h2 id="related-heading" className="font-display text-[1.9rem] font-bold text-burgundy">
            {item.kind === "combo" ? "Related Combos" : "You May Also Like"}
          </h2>
          <div className="mt-5">
            <CatalogGrid items={related} />
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section aria-labelledby="recent-heading" className="mt-14">
          <h2 id="recent-heading" className="font-display text-[1.9rem] font-bold text-burgundy">
            Recently Viewed
          </h2>
          <div className="mt-5">
            <CatalogGrid items={recent} />
          </div>
        </section>
      )}
      {/* Mobile sticky purchase bar (only when main buttons are scrolled away) */}
      {!soldOut && (
        <>
          <div aria-hidden="true" className="h-20 lg:hidden" />
          <div
            className={`fixed inset-x-0 bottom-0 z-30 border-t border-gold/40 bg-ivory/95 px-4 py-2.5 shadow-[0_-10px_30px_-18px_rgba(53,23,15,0.5)] backdrop-blur transition-transform duration-300 lg:hidden ${
              actionsVisible ? "pointer-events-none translate-y-full" : "translate-y-0"
            }`}
            inert={actionsVisible}
          >
            <div className="mx-auto flex max-w-xl items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-[1rem] font-semibold text-ink">{item.name}</p>
                <p className="font-sans text-xs text-umber">
                  {variant.label} · <span className="font-bold text-burgundy">{formatPrice(variant.price)}</span>
                </p>
              </div>
              <div className="w-40 shrink-0">
                <AddToCartButton itemKey={item.key} variantId={variant.id} quantity={quantity} name={`${item.name} (${variant.label})`} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
