import { Skeleton } from "@/components/ui/skeleton";

export function ManageVenuesSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="grid grid-cols-[1fr_120px_90px_120px_100px] gap-0 p-3 border-b bg-muted/30">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_120px_90px_120px_100px] gap-0 p-3"
          >
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
