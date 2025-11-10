import { Skeleton } from "../ui/skeleton";

export function VenueDetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
        <div className="flex gap-3">
          <Skeleton className="h-24 w-32 rounded-lg" />
          <Skeleton className="h-24 w-32 rounded-lg" />
          <Skeleton className="h-24 w-32 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-[460px] w-full rounded-lg" />
      </div>
    </div>
  );
}
