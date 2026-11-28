import type { Metadata } from "next";
import { Suspense } from "react";

import { SettingsForm } from "@/components/admin/SettingsForm";
import { AdminLoading, AdminPageHeader, ErrorState, Flash } from "@/components/admin/ui";
import type { StoreSettings } from "@/lib/admin/schemas";
import { business, businessHours } from "@/content/contact";
import { commerce } from "@/content/commerce";
import { announcements } from "@/content/site";
import { requireAdmin } from "@/lib/server/auth";
import { load } from "@/lib/server/load";
import { readDoc } from "@/lib/server/repo/documents";

import { saveSettings } from "../content-actions";

export const metadata: Metadata = { title: "Store Settings" };

/** Starting values taken from the current website content (not saved until you click Save). */
const fromWebsite: StoreSettings = {
  storeName: business.name,
  email: business.email,
  phones: [...business.phones],
  whatsapp: business.whatsapp,
  whatsappGreeting: "Hello S.G.S King Foods, I would like to know more about your products.",
  addressLines: [...business.addressLines],
  businessHours: [...businessHours],
  deliveryFee: commerce.deliveryFee ?? undefined,
  freeDeliveryAbove: commerce.freeDeliveryAbove ?? undefined,
  codEnabled: false,
  announcement: announcements.map((a) => a.label),
};

async function Content({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin("/admin/settings");
  const params = await searchParams;
  const res = await load(() => readDoc("settings"));
  if (!res.ok) return <ErrorState {...res} />;
  return (
    <>
      <Flash params={params} />
      {!res.data.data && (
        <p className="mb-4 rounded-xl border border-gold/50 bg-gold-pale/60 px-4 py-3 font-sans text-sm text-ink">
          No settings saved yet. The form shows the values currently built into the website. Review and save to store them.
        </p>
      )}
      <SettingsForm action={saveSettings} initial={res.data.data ?? fromWebsite} etag={res.data.etag} />
    </>
  );
}

export default function SettingsPage({ searchParams }: PageProps<"/admin/settings">) {
  return (
    <>
      <AdminPageHeader title="Store Settings" description="Store details, contact, WhatsApp, delivery and storefront content." crumbs={[{ label: "Settings" }]} />
      <Suspense fallback={<AdminLoading label="Loading settings" />}>
        <Content searchParams={searchParams} />
      </Suspense>
    </>
  );
}
