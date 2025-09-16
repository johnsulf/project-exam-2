import { VenueCardSkeleton } from "./VenueCardSkeleton";

export function VenueListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <VenueCardSkeleton key={i} />
      ))}
    </div>
  );
}
