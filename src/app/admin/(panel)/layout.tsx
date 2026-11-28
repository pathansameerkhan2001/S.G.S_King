import { connection } from "next/server";
import { Suspense } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/server/auth";

function ShellLoading() {
  return (
    <div role="status" className="grid min-h-dvh place-items-center bg-[#fbf6ee] font-sans text-sm text-umber">
      Checking your admin session…
    </div>
  );
}

/** Every page under /admin (except login/auth) is rendered only for a verified ADMIN session. */
async function GatedShell({ children }: { children: React.ReactNode }) {
  await connection();
  const session = await requireAdmin();
  return <AdminShell session={session}>{children}</AdminShell>;
}

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={<ShellLoading />}>
      <GatedShell>{children}</GatedShell>
    </Suspense>
  );
}
