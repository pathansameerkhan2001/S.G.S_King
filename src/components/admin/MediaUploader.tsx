"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { inputClass, labelClass } from "./forms";
import { primaryButton } from "./ui";

const folders = ["products", "combos", "categories", "homepage", "reviews"] as const;

/** Uploads images to the library (server validates type, size and session). */
export function MediaUploader() {
  const router = useRouter();
  const [folder, setFolder] = useState<(typeof folders)[number]>("products");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setMessage(null);
    let ok = 0;
    const failures: string[] = [];
    for (const file of Array.from(files).slice(0, 20)) {
      const body = new FormData();
      body.set("file", file);
      body.set("folder", folder);
      try {
        const res = await fetch("/api/admin/media", { method: "POST", body });
        const json = (await res.json()) as { error?: string };
        if (res.ok) ok++;
        else failures.push(`${file.name}: ${json.error ?? "failed"}`);
      } catch {
        failures.push(`${file.name}: network error`);
      }
    }
    setBusy(false);
    setMessage({ ok: failures.length === 0, text: `${ok} uploaded.${failures.length ? ` ${failures.join("; ")}` : ""}` });
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="upload-folder" className={labelClass}>Folder</label>
        <select id="upload-folder" value={folder} onChange={(e) => setFolder(e.target.value as (typeof folders)[number])} className={inputClass}>
          {folders.map((f) => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
        </select>
      </div>
      <label className={`${primaryButton} cursor-pointer ${busy ? "pointer-events-none opacity-60" : ""}`}>
        {busy ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <ImagePlus aria-hidden="true" className="size-4" />}
        {busy ? "Uploading…" : "Upload images"}
        <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,image/gif" disabled={busy} onChange={(e) => { upload(e.target.files); e.target.value = ""; }} className="sr-only" />
      </label>
      {message && (
        <p role={message.ok ? "status" : "alert"} className={`font-sans text-sm font-semibold ${message.ok ? "text-[#2f7a3d]" : "text-burgundy"}`}>{message.text}</p>
      )}
    </div>
  );
}
