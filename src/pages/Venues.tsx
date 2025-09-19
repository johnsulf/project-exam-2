import { useVenues } from "@/features/venues/hooks";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/money";
import { VenueListSkeleton } from "@/components/skeletons/VenueListSkeleton";
import { Link } from "react-router-dom";

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
        {venues.map((v) => {
          const firstMedia = v.media?.[0];
          const imageUrl = firstMedia?.url;
          const imageAlt = firstMedia?.alt ?? `Image of ${v.name}`;
          const numericRating =
            typeof v.rating === "number" && !Number.isNaN(v.rating)
              ? v.rating
              : null;
          const hasRating = numericRating !== null && numericRating > 0;
          const highlightStar = numericRating !== null && numericRating >= 1;
          return (
            <div key={v.id} className="rounded-md shadow border p-2 grid gap-2">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="w-full h-48 object-cover rounded-md"
                />
              ) : (
                <div
                  role="img"
                  aria-label={`No image available for ${v.name}`}
                  className="w-full h-48 flex items-center justify-center rounded-md bg-muted text-muted-foreground"
                >
                  <span>No image available</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                {v.location?.city && v.location?.country && (
                  <div className="text-sm font-semibold">
                    {v.location?.city}, {v.location?.country}
                  </div>
                )}
                <div className="flex gap-1 items-center text-sm font-semibold ml-auto">
                  <Star
                    className={
                      highlightStar
                        ? "text-yellow-500"
                        : "text-muted-foreground"
                    }
                  />
                  <p>
                    {hasRating ? numericRating!.toPrecision(2) : "No ratings"}
                  </p>
                </div>
              </div>

              <h3>{v.name}</h3>

              <div className="flex gap-1 flex-wrap">
                <Badge variant="secondary">Guests: {v.maxGuests}</Badge>
                {v.meta?.parking ? (
                  <Badge variant="secondary">Parking</Badge>
                ) : null}
                {v.meta?.wifi ? <Badge variant="secondary">WiFi</Badge> : null}
                {v.meta?.pets ? <Badge variant="secondary">Pets</Badge> : null}
                {v.meta?.breakfast ? (
                  <Badge variant="secondary">Breakfast</Badge>
                ) : null}
              </div>

              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">
                  {formatMoney(v.price, { currency: "USD" })} / night
                </p>
                <Link to={`/venues/${v.id}`}>
                  <Button variant="default">
                    View Details
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      {isFetching && <div className="mt-3 text-sm opacity-70">Refreshing…</div>}
    </>
  );
}
