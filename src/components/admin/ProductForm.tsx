"use client";

import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useState } from "react";

import type { Category, Product, ProductInput } from "@/lib/admin/schemas";

import { FieldError, FormMessage, initialActionState, inputClass, labelClass, SubmitButton, Toggle, type ActionState } from "./forms";
import { ImagePicker, type LibraryImage } from "./ImagePicker";
import { Card, secondaryButton } from "./ui";

type Variant = { id: string; label: string; price: string; mrp: string; stock: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

type ProductFormProps = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  product?: Product;
  categories: Pick<Category, "categoryId" | "name">[];
  library: LibraryImage[];
  previews: Record<string, string>;
};

export function ProductForm({ action, product, categories, library, previews }: ProductFormProps) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!product);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [variants, setVariants] = useState<Variant[]>(
    product?.variants.map((v) => ({ id: v.id, label: v.label, price: String(v.price), mrp: v.mrp?.toString() ?? "", stock: v.stock?.toString() ?? "" })) ?? [
      { id: "default", label: "", price: "", mrp: "", stock: "" },
    ],
  );
  const [flags, setFlags] = useState({
    visible: product?.visible ?? true,
    isBestseller: product?.isBestseller ?? false,
    isFeatured: product?.isFeatured ?? false,
  });

  const updateVariant = (i: number, patch: Partial<Variant>) => setVariants((vs) => vs.map((v, j) => (j === i ? { ...v, ...patch } : v)));

  const buildPayload = (form: HTMLFormElement) => {
    const f = new FormData(form);
    const data: Partial<ProductInput> & Record<string, unknown> = {
      name,
      slug,
      description: String(f.get("description") ?? ""),
      categoryId: String(f.get("categoryId") ?? ""),
      variants: variants.map((v) => ({ id: v.id.trim(), label: v.label, price: v.price, mrp: v.mrp, stock: v.stock })) as unknown as ProductInput["variants"],
      images,
      badge: String(f.get("badge") ?? ""),
      ingredients: String(f.get("ingredients") ?? ""),
      storage: String(f.get("storage") ?? ""),
      availability: String(f.get("availability") ?? "in_stock") as ProductInput["availability"],
      displayOrder: Number(f.get("displayOrder") ?? 100),
      ...flags,
    };
    return JSON.stringify({ productId: product?.productId, version: product?.version, data });
  };

  const err = (k: string) => state.errors?.[k];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.set("payload", buildPayload(e.currentTarget));
        startTransition(() => formAction(fd));
      }}
      className="space-y-5"
      noValidate
      aria-busy={pending || undefined}
    >
      <FormMessage state={state} />

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Card>
            <h2 className="mb-4 font-display text-[1.3rem] font-bold text-burgundy">Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className={labelClass}>
                  Product name *
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slugTouched) setSlug(slugify(e.target.value));
                  }}
                  aria-invalid={!!err("name") || undefined}
                  className={inputClass}
                />
                <FieldError state={state} name="name" />
              </div>
              <div>
                <label htmlFor="slug" className={labelClass}>
                  URL slug *
                </label>
                <input
                  id="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(slugify(e.target.value));
                    setSlugTouched(true);
                  }}
                  aria-invalid={!!err("slug") || undefined}
                  aria-describedby="slug-hint"
                  className={inputClass}
                />
                <p id="slug-hint" className="mt-1 font-sans text-xs text-umber">
                  /products/{slug || "…"}
                </p>
                <FieldError state={state} name="slug" />
              </div>
              <div>
                <label htmlFor="categoryId" className={labelClass}>
                  Category *
                </label>
                <select id="categoryId" name="categoryId" defaultValue={product?.categoryId ?? ""} aria-invalid={!!err("categoryId") || undefined} className={inputClass}>
                  <option value="">Select…</option>
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && <p className="mt-1 font-sans text-xs text-burgundy">Create a category first.</p>}
                <FieldError state={state} name="categoryId" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="description" className={labelClass}>
                  Description
                </label>
                <textarea id="description" name="description" defaultValue={product?.description} rows={4} className={`${inputClass} h-auto py-2`} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-[1.3rem] font-bold text-burgundy">Sizes &amp; prices</h2>
              <button
                type="button"
                onClick={() => setVariants((vs) => [...vs, { id: `size-${vs.length + 1}`, label: "", price: "", mrp: "", stock: "" }])}
                disabled={variants.length >= 12}
                className={secondaryButton}
              >
                <Plus aria-hidden="true" className="size-4" />
                Add size
              </button>
            </div>
            <FieldError state={state} name="variants" />
            <div className="space-y-3">
              {variants.map((v, i) => (
                <fieldset key={i} className="grid grid-cols-2 gap-2 rounded-xl border border-gold/25 p-3 sm:grid-cols-[1fr_1.2fr_1fr_1fr_1fr_auto]">
                  <legend className="sr-only">Size {i + 1}</legend>
                  {(
                    [
                      ["id", "Size ID", "e.g. 250g"],
                      ["label", "Label *", "250 g"],
                      ["price", "Price ₹ *", "269"],
                      ["mrp", "Original ₹", "299"],
                      ["stock", "Stock", "units"],
                    ] as const
                  ).map(([field, lbl, ph]) => (
                    <div key={field}>
                      <label htmlFor={`v${i}-${field}`} className={labelClass}>
                        {lbl}
                      </label>
                      <input
                        id={`v${i}-${field}`}
                        value={v[field]}
                        placeholder={ph}
                        inputMode={field === "id" || field === "label" ? undefined : "numeric"}
                        onChange={(e) => updateVariant(i, { [field]: e.target.value })}
                        aria-invalid={!!err(`variants.${i}.${field}`) || undefined}
                        className={inputClass}
                      />
                      <FieldError state={state} name={`variants.${i}.${field}`} />
                    </div>
                  ))}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => setVariants((vs) => vs.filter((_, j) => j !== i))}
                      disabled={variants.length === 1}
                      aria-label={`Remove size ${i + 1}`}
                      className="grid size-11 place-items-center rounded-xl text-burgundy hover:bg-[#fde8e6] disabled:opacity-30"
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                </fieldset>
              ))}
            </div>
            <p className="mt-2 font-sans text-xs text-umber">“Original” is the crossed-out price; the discount % is calculated automatically. Leave stock empty if not tracked.</p>
          </Card>

          <Card>
            <h2 className="mb-4 font-display text-[1.3rem] font-bold text-burgundy">Images</h2>
            <ImagePicker label="Product images" folder="products" value={images} onChange={setImages} previews={previews} library={library} max={8} />
          </Card>

          <Card>
            <h2 className="mb-1 font-display text-[1.3rem] font-bold text-burgundy">Product information</h2>
            <p className="mb-4 font-sans text-xs text-umber">Only enter confirmed information. Empty fields are hidden on the storefront.</p>
            <div className="grid gap-4">
              <div>
                <label htmlFor="ingredients" className={labelClass}>
                  Ingredients
                </label>
                <textarea id="ingredients" name="ingredients" defaultValue={product?.ingredients} rows={2} className={`${inputClass} h-auto py-2`} />
              </div>
              <div>
                <label htmlFor="storage" className={labelClass}>
                  Storage instructions
                </label>
                <textarea id="storage" name="storage" defaultValue={product?.storage} rows={2} className={`${inputClass} h-auto py-2`} />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <h2 className="mb-3 font-display text-[1.3rem] font-bold text-burgundy">Status</h2>
            <label htmlFor="availability" className={labelClass}>
              Stock status
            </label>
            <select id="availability" name="availability" defaultValue={product?.availability ?? "in_stock"} className={inputClass}>
              <option value="in_stock">In stock</option>
              <option value="low_stock">Low stock</option>
              <option value="out_of_stock">Out of stock</option>
            </select>
            <div className="mt-3">
              <Toggle label="Visible on storefront" checked={flags.visible} onChange={(v) => setFlags((f) => ({ ...f, visible: v }))} />
              <Toggle label="Bestseller" checked={flags.isBestseller} onChange={(v) => setFlags((f) => ({ ...f, isBestseller: v }))} />
              <Toggle label="Featured" checked={flags.isFeatured} onChange={(v) => setFlags((f) => ({ ...f, isFeatured: v }))} />
            </div>
          </Card>
          <Card>
            <label htmlFor="badge" className={labelClass}>
              Badge (optional)
            </label>
            <input id="badge" name="badge" defaultValue={product?.badge} placeholder="e.g. Traditional Favourite" className={inputClass} />
            <label htmlFor="displayOrder" className={`${labelClass} mt-3`}>
              Display order
            </label>
            <input id="displayOrder" name="displayOrder" type="number" min={0} defaultValue={product?.displayOrder ?? 100} className={inputClass} />
            <p className="mt-1 font-sans text-xs text-umber">Lower numbers appear first.</p>
          </Card>
          <div className="flex flex-wrap gap-2">
            <SubmitButton pending={pending}>{product ? "Save changes" : "Create product"}</SubmitButton>
            <Link href="/admin/products" className={secondaryButton}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
