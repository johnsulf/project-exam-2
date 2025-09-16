import { Skeleton } from "@/components/ui/skeleton";

export function VenueCardSkeleton() {
  return (
    <div className="rounded-md shadow border p-2 grid gap-2">
      {/* image */}
      <Skeleton className="w-full h-48 rounded-md" />

      {/* top row: location + rating */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* title */}
      <Skeleton className="h-5 w-3/4" />

      {/* badges row */}
      <div className="flex gap-1 flex-wrap">
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="h-6 w-16 rounded" />
        <Skeleton className="h-6 w-12 rounded" />
        <Skeleton className="h-6 w-20 rounded" />
      </div>

      {/* footer: price + button */}
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
    </div>
  );
}
