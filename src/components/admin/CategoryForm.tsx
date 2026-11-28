"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";

import type { Category } from "@/lib/admin/schemas";

import { FieldError, FormMessage, initialActionState, inputClass, labelClass, SubmitButton, Toggle, type ActionState } from "./forms";
import { ImagePicker, type LibraryImage } from "./ImagePicker";
import { Card, secondaryButton } from "./ui";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

export function CategoryForm({
  action,
  category,
  library,
  previews,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  category?: Category;
  library: LibraryImage[];
  previews: Record<string, string>;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const [name, setName] = useState(category?.name ?? "");
  const [id, setId] = useState(category?.categoryId ?? "");
  const [idTouched, setIdTouched] = useState(!!category);
  const [image, setImage] = useState<string[]>(category?.imageKey ? [category.imageKey] : []);
  const [visible, setVisible] = useState(category?.visible ?? true);

  return (
    <form
      noValidate
      aria-busy={pending || undefined}
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const fd = new FormData();
        fd.set(
          "payload",
          JSON.stringify({
            isNew: !category,
            version: category?.version,
            data: { categoryId: id, name, description: String(f.get("description") ?? ""), imageKey: image[0], displayOrder: Number(f.get("displayOrder") ?? 0), visible },
          }),
        );
        startTransition(() => formAction(fd));
      }}
      className="max-w-3xl space-y-5"
    >
      <FormMessage state={state} />
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>Name *</label>
            <input
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!idTouched) setId(slugify(e.target.value));
              }}
              aria-invalid={!!state.errors?.name || undefined}
              className={inputClass}
            />
            <FieldError state={state} name="name" />
          </div>
          <div>
            <label htmlFor="categoryId" className={labelClass}>Category ID / URL slug *</label>
            <input
              id="categoryId"
              value={id}
              disabled={!!category}
              onChange={(e) => {
                setId(slugify(e.target.value));
                setIdTouched(true);
              }}
              aria-describedby="categoryId-hint"
              aria-invalid={!!state.errors?.categoryId || undefined}
              className={`${inputClass} disabled:opacity-70`}
            />
            <p id="categoryId-hint" className="mt-1 font-sans text-xs text-umber">
              /categories/{id || "…"} {category && "· cannot be changed (products reference it)"}
            </p>
            <FieldError state={state} name="categoryId" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea id="description" name="description" defaultValue={category?.description} rows={4} className={`${inputClass} h-auto py-2`} />
          </div>
          <div>
            <label htmlFor="displayOrder" className={labelClass}>Display order</label>
            <input id="displayOrder" name="displayOrder" type="number" min={0} defaultValue={category?.displayOrder ?? 0} className={inputClass} />
          </div>
          <div className="flex items-end">
            <Toggle label="Visible on storefront" checked={visible} onChange={setVisible} />
          </div>
        </div>
      </Card>
      <Card>
        <ImagePicker label="Category image" folder="categories" value={image} onChange={setImage} previews={previews} library={library} max={1} />
      </Card>
      <div className="flex gap-2">
        <SubmitButton pending={pending}>{category ? "Save changes" : "Create category"}</SubmitButton>
        <Link href="/admin/categories" className={secondaryButton}>Cancel</Link>
      </div>
    </form>
  );
}
