import { useVenues } from "@/features/venues/hooks";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/money";
import { VenueListSkeleton } from "@/components/skeletons/VenueListSkeleton";

export default function Venues() {
  const { data, isLoading, isError, refetch, isFetching } = useVenues({
    page: 1,
    limit: 20,
  });

  if (isLoading) {
    return <VenueListSkeleton count={20} />;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {venues.map((v) => (
          <div key={v.id} className="rounded-md shadow border p-2 grid gap-2">
            <img
              src={v.media[0].url}
              alt={`Image of ${v.name}`}
              className="w-full h-48 object-cover rounded-md"
            />

            <div className="flex justify-between items-center">
              {v.location?.city && v.location?.country && (
                <div className="text-sm font-semibold">
                  {v.location?.city}, {v.location?.country}
                </div>
              )}
              <div className="flex gap-1 items-center text-sm font-semibold ml-auto">
                <Star
                  className={
                    v.rating! >= 1 ? "text-yellow-500" : "text-muted-foreground"
                  }
                />
                <p>{v.rating == 0 ? "No ratings" : v.rating!.toPrecision(2)}</p>
              </div>
            </div>

            <h3>{v.name}</h3>

            <div className="flex gap-1 flex-wrap">
              <Badge variant="secondary">Guests: {v.maxGuests}</Badge>
              {v.meta!.parking ? (
                <Badge variant="secondary">Parking</Badge>
              ) : null}
              {v.meta!.wifi ? <Badge variant="secondary">WiFi</Badge> : null}
              {v.meta!.pets ? <Badge variant="secondary">Pets</Badge> : null}
              {v.meta!.breakfast ? (
                <Badge variant="secondary">Breakfast</Badge>
              ) : null}
            </div>

            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">
                {formatMoney(v.price, { currency: "USD" })} / night
              </p>
              <Button variant="default">
                View Details
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {isFetching && <div className="mt-3 text-sm opacity-70">Refreshing…</div>}
    </>
  );
}
