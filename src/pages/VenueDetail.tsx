import { useParams } from "react-router-dom";
import { useVenue } from "@/features/venues/hooks";
import { VenueGallery } from "@/features/venues/VenueGallery";
import { BookingWidget } from "@/features/bookings/BookingWidget";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: venue, isLoading, isError } = useVenue(id);

  if (isLoading) return <VenueDetailSkeleton />;
  if (isError || !venue)
    return <p className="text-destructive">Couldn’t load venue.</p>;

  const city = venue.location?.city;
  const country = venue.location?.country;
  const locLine = city && country ? `${city}, ${country}` : undefined;

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_380px]">
      {/* Left column */}
      <section className="space-y-6">
        <VenueGallery
          media={venue.media ?? []}
          venueName={venue.name}
          className=""
        />

        <header className="space-y-1">
          <h1 className="text-3xl font-semibold">{venue.name}</h1>
          {locLine && <p className="text-muted-foreground">{locLine}</p>}
        </header>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Guests {venue.maxGuests}</Badge>
          {venue.meta?.parking && <Badge variant="secondary">Parking</Badge>}
          {venue.meta?.wifi && <Badge variant="secondary">WiFi</Badge>}
          {venue.meta?.pets && <Badge variant="secondary">Pets</Badge>}
          {venue.meta?.breakfast && (
            <Badge variant="secondary">Breakfast</Badge>
          )}
        </div>

        {/* Owner */}
        {venue._owner?.name && (
          <div className="rounded-xl border p-4">
            <div className="flex items-center gap-3">
              {venue._owner.avatar?.url ? (
                <img
                  src={venue._owner.avatar.url}
                  alt={venue._owner.avatar.alt || venue._owner.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-muted" />
              )}
              <div className="text-sm">
                <span className="font-medium">{venue._owner.name}</span>{" "}
                <span className="text-muted-foreground">is the owner</span>
              </div>
            </div>
          </div>
        )}

        <article className="prose max-w-none">
          <p>{venue.description}</p>
        </article>
      </section>

      {/* Right column */}
      <aside className="md:pl-2">
        <div className="sticky top-20">
          <BookingWidget
            venueId={venue.id}
            price={venue.price}
            maxGuests={venue.maxGuests}
            bookings={(venue._bookings ?? []).map((b) => ({
              dateFrom: b.dateFrom,
              dateTo: b.dateTo,
            }))}
          />
        </div>
      </aside>
    </div>
  );
}

function VenueDetailSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        <div className="flex gap-3">
          <Skeleton className="h-24 w-32 rounded-xl" />
          <Skeleton className="h-24 w-32 rounded-xl" />
          <Skeleton className="h-24 w-32 rounded-xl" />
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
      <div className="space-y-3">
        <Skeleton className="h-[460px] w-full rounded-xl" />
      </div>
    </div>
  );
}
