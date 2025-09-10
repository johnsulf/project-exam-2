import { useVenues } from "@/features/venues/hooks";
import { Button } from "@/components/ui/button";

export default function Venues() {
  const { data, isLoading, isError, refetch, isFetching } = useVenues({
    page: 1,
    limit: 20,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-64 rounded-md bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <p className="text-destructive">Couldn’t load venues.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const venues = data?.data ?? [];
  if (!venues.length) {
    return <p>No venues match your filters.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {venues.map((v) => (
          <div key={v.id} className="rounded-md border p-4">
            <div className="font-medium">{v.name}</div>
            <div className="text-sm opacity-70">
              {v.location?.city}, {v.location?.country}
            </div>
            <div className="mt-2 text-sm">€{v.price} / night</div>
          </div>
        ))}
      </div>
      {isFetching && <div className="mt-3 text-sm opacity-70">Refreshing…</div>}
    </>
  );
}
