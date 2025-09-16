import { Skeleton } from "@/components/ui/skeleton";

export function VenueCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
