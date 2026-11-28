import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ConfirmSubmit } from "@/components/admin/forms";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { AdminLoading, AdminPageHeader, Badge, Card, EmptyState, ErrorState, Flash, formatDate, matchesQ } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/server/auth";
import { load } from "@/lib/server/load";
import { listMedia, mediaFolders, mediaUsageMap, type MediaFolder } from "@/lib/server/repo/media";

import { removeMedia } from "./actions";

export const metadata: Metadata = { title: "Media Library" };

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

async function MediaContent({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin("/admin/media");
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const folder = mediaFolders.includes(params.folder as MediaFolder) ? (params.folder as MediaFolder) : undefined;
  const res = await load(() => Promise.all([listMedia(folder), mediaUsageMap()]));
  if (!res.ok) return <ErrorState {...res} />;
  const [items, usage] = res.data;
  const rows = items.filter((m) => matchesQ(q, m.name, m.folder));

  return (
    <>
      <Flash params={params} />
      <Card className="mb-5">
        <MediaUploader />
        <p className="mt-2 font-sans text-xs text-umber">JPEG, PNG, WebP, AVIF or GIF, checked on the server. Files are stored privately in S3.</p>
      </Card>
      <nav aria-label="Folders" className="mb-4 flex flex-wrap gap-2">
        {[undefined, ...mediaFolders].map((f) => (
          <Link
            key={f ?? "all"}
            href={f ? `/admin/media?folder=${f}` : "/admin/media"}
            aria-current={folder === f ? "page" : undefined}
            className={`inline-flex min-h-10 items-center rounded-full border px-4 font-sans text-sm font-semibold ${folder === f ? "border-burgundy bg-burgundy text-ivory" : "border-gold/50 text-ink hover:border-burgundy"}`}
          >
            {f ? f.charAt(0).toUpperCase() + f.slice(1) : "All"}
          </Link>
        ))}
      </nav>
      {items.length === 0 ? (
        <EmptyState title="No images yet" text="Upload product, combo, category and homepage images above." />
      ) : rows.length === 0 ? (
        <EmptyState title="No images match" />
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {rows.map((m) => {
            const uses = usage.get(m.key) ?? [];
            return (
              <li key={m.key} className="overflow-hidden rounded-2xl border border-gold/25 bg-ivory">
                {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed S3 URL */}
                <img src={m.url} alt={m.name} loading="lazy" className="aspect-square w-full bg-cream object-cover" />
                <div className="space-y-1 p-3 font-sans text-xs">
                  <p className="truncate font-semibold text-ink" title={m.key}>{m.name}</p>
                  <p className="text-umber">{m.folder} · {kb(m.size)} · {formatDate(m.uploadedAt)}</p>
                  {uses.length ? (
                    <p title={uses.join("\n")}><Badge tone="info">In use ({uses.length})</Badge></p>
                  ) : (
                    <div className="flex items-center justify-between">
                      <Badge>Unused</Badge>
                      <ConfirmSubmit compact action={removeMedia} label={`Delete ${m.name}`} title="Delete this image?" description="It is not used anywhere. This permanently removes it from storage." hidden={{ key: m.key }} />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default function MediaPage({ searchParams }: PageProps<"/admin/media">) {
  return (
    <>
      <AdminPageHeader title="Media Library" description="Upload, preview and reuse images. Images in use cannot be deleted." crumbs={[{ label: "Media" }]} />
      <Suspense fallback={<AdminLoading label="Loading media" />}>
        <MediaContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
