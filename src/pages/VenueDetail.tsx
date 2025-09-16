import { useParams } from "react-router-dom";
import { useVenue } from "@/features/venues/hooks";
import { BookingWidget } from "@/features/bookings/BookingWidget";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: venue, isLoading, isError } = useVenue(id);

  if (isLoading) return <VenueDetailSkeleton />;
  if (isError || !venue)
    return <p className="text-destructive">Couldn’t load venue.</p>;

  const img = venue.media?.[0]?.url;

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        {/* Gallery (simple) */}
        <div className="overflow-hidden rounded-xl border">
          {img ? (
            <img
              src={img}
              alt={venue.media?.[0]?.alt ?? venue.name}
              className="w-full aspect-[4/3] object-cover"
            />
          ) : (
            <div className="aspect-[4/3] grid place-items-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">{venue.name}</h1>
          {venue.location?.city && venue.location?.country && (
            <p className="text-muted-foreground">
              {venue.location.city}, {venue.location.country}
            </p>
          )}
        </header>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Guests: {venue.maxGuests}</Badge>
          {venue.meta?.wifi && <Badge variant="secondary">WiFi</Badge>}
          {venue.meta?.parking && <Badge variant="secondary">Parking</Badge>}
          {venue.meta?.pets && <Badge variant="secondary">Pets</Badge>}
          {venue.meta?.breakfast && (
            <Badge variant="secondary">Breakfast</Badge>
          )}
        </div>

        <article className="prose max-w-none">
          <p>{venue.description}</p>
        </article>

        {/* Owner */}
        {venue._owner?.name && (
          <div className="rounded-xl border p-4">
            <div className="text-sm text-muted-foreground">Hosted by</div>
            <div className="font-medium">{venue._owner.name}</div>
          </div>
        )}
      </section>

      <BookingWidget
        venueId={venue.id}
        price={venue.price}
        maxGuests={venue.maxGuests}
        bookings={
          venue._bookings?.map((b) => ({
            dateFrom: b.dateFrom,
            dateTo: b.dateTo,
          })) ?? []
        }
      />
    </div>
  );
}

function VenueDetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        <Skeleton className="h-7 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-[420px] w-full rounded-xl" />
      </div>
    </div>
  );
}
