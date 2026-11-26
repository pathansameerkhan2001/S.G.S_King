/** Loading skeletons (shown while a route segment streams in). */

const pulse = "animate-pulse rounded-xl bg-gold-pale/70 motion-reduce:animate-none";

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul aria-hidden="true" className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="overflow-hidden rounded-2xl border border-gold/25 bg-ivory">
          <div className={`aspect-square rounded-none ${pulse}`} />
          <div className="space-y-2 p-4">
            <div className={`h-3 w-1/3 ${pulse}`} />
            <div className={`h-5 w-3/4 ${pulse}`} />
            <div className={`h-5 w-1/2 ${pulse}`} />
            <div className={`mt-3 h-11 w-full ${pulse}`} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function PageLoading({ label = "Loading", variant = "grid" }: { label?: string; variant?: "grid" | "detail" }) {
  return (
    <div role="status" aria-live="polite" className="heritage-paper">
      <span className="sr-only">{label}…</span>
      <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-8 lg:px-10 lg:py-12">
        <div className={`mb-8 h-4 w-48 ${pulse}`} />
        {variant === "detail" ? (
          <div aria-hidden="true" className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className={`aspect-square ${pulse}`} />
            <div className="space-y-4">
              <div className={`h-4 w-32 ${pulse}`} />
              <div className={`h-12 w-4/5 ${pulse}`} />
              <div className={`h-5 w-full ${pulse}`} />
              <div className={`h-24 w-full ${pulse}`} />
              <div className={`h-12 w-2/3 ${pulse}`} />
              <div className={`h-13 w-full ${pulse}`} />
            </div>
          </div>
        ) : (
          <>
            <div className={`mx-auto mb-8 h-12 w-2/3 max-w-md ${pulse}`} />
            <CardGridSkeleton />
          </>
        )}
      </div>
    </div>
  );
}
