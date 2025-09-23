import { Skeleton } from "@/components/ui/skeleton";
export function BookingListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[140px_1fr] gap-0 rounded-md border overflow-hidden"
        >
          <Skeleton className="h-24 w-full" />
          <div className="p-3 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}
