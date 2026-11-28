"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

import { ErrorState, primaryButton } from "@/components/admin/ui";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="space-y-4">
      <ErrorState title="Something went wrong" text="This admin page could not be loaded. Your data has not been changed." details={error.digest ? [`Reference: ${error.digest}`] : undefined} />
      <button type="button" onClick={reset} className={primaryButton}>
        <RotateCcw aria-hidden="true" className="size-4" />
        Try again
      </button>
    </div>
  );
}
