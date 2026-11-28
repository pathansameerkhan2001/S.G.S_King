import { Pencil, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ConfirmSubmit } from "@/components/admin/forms";
import { ReviewForm } from "@/components/admin/ReviewCouponForms";
import { AdminLoading, AdminPageHeader, Badge, Card, EmptyState, ErrorState, Flash, matchesQ } from "@/components/admin/ui";
import { mediaLibrary, previewsFor } from "@/lib/server/admin-data";
import { requireAdmin } from "@/lib/server/auth";
import { load } from "@/lib/server/load";
import { readDoc } from "@/lib/server/repo/documents";

import { removeReview, saveReview } from "../content-actions";

export const metadata: Metadata = { title: "Reviews" };

async function Content({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin("/admin/reviews");
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const editId = typeof params.edit === "string" ? params.edit : undefined;
  const res = await load(async () => {
    const [doc, library] = await Promise.all([readDoc("reviews"), mediaLibrary("reviews")]);
    return { doc, library, previews: await previewsFor(doc.data.map((r) => r.imageKey)) };
  });
  if (!res.ok) return <ErrorState {...res} />;
  const { doc, library, previews } = res.data;
  const reviews = [...doc.data].sort((a, b) => a.displayOrder - b.displayOrder);
  const editing = editId ? reviews.find((r) => r.id === editId) : undefined;
  const rows = reviews.filter((r) => matchesQ(q, r.customerName, r.text, r.location));

  return (
    <>
      <Flash params={params} />
      <Card className="mb-6">
        <h2 className="mb-3 font-display text-[1.3rem] font-bold text-burgundy">{editing ? `Edit review by ${editing.customerName}` : "Add a review"}</h2>
        <p className="mb-3 font-sans text-xs text-umber">Only add real customer feedback. New reviews start unapproved and hidden.</p>
        <ReviewForm key={editing?.id ?? "new"} action={saveReview} review={editing} etag={doc.etag} library={library} previews={previews} />
      </Card>
      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" text="Add real customer reviews or testimonials above." />
      ) : rows.length === 0 ? (
        <EmptyState title="No reviews match" />
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">
                      {r.customerName}
                      {r.location && <span className="font-normal text-umber">, {r.location}</span>}
                    </p>
                    <p className="flex items-center gap-0.5 text-gold" aria-label={`${r.rating} out of 5`}>
                      {Array.from({ length: r.rating }, (_, i) => <Star key={i} aria-hidden="true" className="size-4 fill-gold" />)}
                    </p>
                    <p className="mt-1 font-sans text-sm text-ink/85">{r.text}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {r.approved ? <Badge tone="good">Approved</Badge> : <Badge tone="warn">Awaiting approval</Badge>}
                      {r.visible ? <Badge tone="info">Visible</Badge> : <Badge>Hidden</Badge>}
                      {r.verifiedPurchase && <Badge tone="good">Verified purchase · {r.orderId}</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/admin/reviews?edit=${r.id}`} aria-label={`Edit review by ${r.customerName}`} className="grid size-10 place-items-center rounded-xl text-burgundy hover:bg-gold-pale"><Pencil aria-hidden="true" className="size-4" /></Link>
                    <ConfirmSubmit compact action={removeReview} label={`Delete review by ${r.customerName}`} title="Delete this review?" description="This permanently removes the review." hidden={{ id: r.id }} />
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function ReviewsPage({ searchParams }: PageProps<"/admin/reviews">) {
  return (
    <>
      <AdminPageHeader title="Reviews" description="Approve and publish real customer reviews and testimonials." crumbs={[{ label: "Reviews" }]} />
      <Suspense fallback={<AdminLoading label="Loading reviews" />}>
        <Content searchParams={searchParams} />
      </Suspense>
    </>
  );
}
