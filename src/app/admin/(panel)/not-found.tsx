import Link from "next/link";

import { EmptyState, primaryButton } from "@/components/admin/ui";

/** Unknown admin record (e.g. a deleted product ID). */
export default function AdminNotFound() {
  return (
    <EmptyState
      title="Record not found"
      text="It may have been deleted, or the link is incorrect."
      action={
        <Link href="/admin" className={primaryButton}>
          Back to dashboard
        </Link>
      }
    />
  );
}
