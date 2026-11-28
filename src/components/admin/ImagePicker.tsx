"use client";

import { ArrowLeft, ArrowRight, ImagePlus, Images, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";

import { secondaryButton } from "./ui";

export type LibraryImage = { key: string; url: string; name: string };

type ImagePickerProps = {
  label: string;
  folder: "products" | "combos" | "categories" | "homepage" | "reviews";
  value: string[];
  onChange: (keys: string[]) => void;
  /** Signed preview URLs for already-selected keys. */
  previews: Record<string, string>;
  library: LibraryImage[];
  max?: number;
};

/** Select images from the media library or upload new ones (server-validated). */
export function ImagePicker({ label, folder, value, onChange, previews: initialPreviews, library: initialLibrary, max = 8 }: ImagePickerProps) {
  const [previews, setPreviews] = useState(initialPreviews);
  const [library, setLibrary] = useState(initialLibrary);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const urlFor = (key: string) => previews[key] ?? library.find((l) => l.key === key)?.url;

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    setUploading(true);
    const added: string[] = [];
    for (const file of Array.from(files).slice(0, max - value.length)) {
      const body = new FormData();
      body.set("file", file);
      body.set("folder", folder);
      try {
        const res = await fetch("/api/admin/media", { method: "POST", body });
        const json = (await res.json()) as { key?: string; url?: string; error?: string };
        if (!res.ok || !json.key || !json.url) {
          setError(json.error ?? "Upload failed.");
          continue;
        }
        added.push(json.key);
        setPreviews((p) => ({ ...p, [json.key!]: json.url! }));
        setLibrary((l) => [{ key: json.key!, url: json.url!, name: file.name }, ...l]);
      } catch {
        setError("Network error while uploading.");
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (added.length) onChange([...value, ...added].slice(0, max));
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...value];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    onChange(next);
  };

  return (
    <fieldset>
      <legend className="mb-1 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-umber">
        {label} <span className="font-normal normal-case tracking-normal">({value.length}/{max}, first image is the main one)</span>
      </legend>
      {value.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-3">
          {value.map((key, i) => (
            <li key={key} className="relative w-28">
              <div className="aspect-square overflow-hidden rounded-xl border border-gold/40 bg-cream">
                {urlFor(key) ? (
                  // eslint-disable-next-line @next/next/no-img-element -- short-lived signed S3 URL
                  <img src={urlFor(key)} alt={`Selected image ${i + 1}`} className="size-full object-cover" />
                ) : (
                  <span className="grid size-full place-items-center p-1 text-center font-sans text-[0.6rem] text-umber">Preview unavailable</span>
                )}
              </div>
              <div className="mt-1 flex justify-between">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move image ${i + 1} earlier`} className="grid size-8 place-items-center rounded-lg text-umber disabled:opacity-30 hover:bg-gold-pale">
                  <ArrowLeft aria-hidden="true" className="size-4" />
                </button>
                <button type="button" onClick={() => onChange(value.filter((k) => k !== key))} aria-label={`Remove image ${i + 1}`} className="grid size-8 place-items-center rounded-lg text-burgundy hover:bg-[#fde8e6]">
                  <X aria-hidden="true" className="size-4" />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label={`Move image ${i + 1} later`} className="grid size-8 place-items-center rounded-lg text-umber disabled:opacity-30 hover:bg-gold-pale">
                  <ArrowRight aria-hidden="true" className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <label className={`${secondaryButton} cursor-pointer ${value.length >= max ? "pointer-events-none opacity-50" : ""}`}>
          {uploading ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <ImagePlus aria-hidden="true" className="size-4" />}
          {uploading ? "Uploading…" : "Upload images"}
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" multiple={max > 1} disabled={uploading || value.length >= max} onChange={(e) => upload(e.target.files)} className="sr-only" />
        </label>
        <button type="button" onClick={() => dialogRef.current?.showModal()} disabled={value.length >= max} className={secondaryButton}>
          <Images aria-hidden="true" className="size-4" />
          Choose from library
        </button>
      </div>
      <p className="mt-1 font-sans text-xs text-umber">JPEG, PNG, WebP, AVIF or GIF · checked on the server.</p>
      {error && (
        <p role="alert" className="mt-1 font-sans text-xs font-semibold text-burgundy">
          {error}
        </p>
      )}

      <dialog ref={dialogRef} aria-label="Media library" className="m-auto w-[min(94vw,820px)] rounded-2xl border border-gold/40 bg-ivory p-0 shadow-card backdrop:bg-ink/50">
        <div className="flex items-center justify-between border-b border-gold/30 px-5 py-3">
          <h2 className="font-display text-[1.4rem] font-bold text-burgundy">Media library</h2>
          <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close media library" className="grid size-10 place-items-center rounded-full hover:bg-gold-pale">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="max-h-[65dvh] overflow-y-auto p-5">
          {library.length === 0 ? (
            <p className="py-8 text-center font-sans text-sm text-umber">No images uploaded yet.</p>
          ) : (
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {library.map((img) => {
                const selected = value.includes(img.key);
                return (
                  <li key={img.key}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onChange(selected ? value.filter((k) => k !== img.key) : [...value, img.key].slice(0, max))}
                      className={`block w-full overflow-hidden rounded-xl border-2 ${selected ? "border-burgundy" : "border-transparent hover:border-gold/60"}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed S3 URL */}
                      <img src={img.url} alt={img.name} className="aspect-square w-full object-cover" loading="lazy" />
                      <span className="sr-only">{selected ? "Selected" : "Not selected"}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="border-t border-gold/30 px-5 py-3 text-right">
          <button type="button" onClick={() => dialogRef.current?.close()} className={secondaryButton}>
            Done
          </button>
        </div>
      </dialog>
    </fieldset>
  );
}
