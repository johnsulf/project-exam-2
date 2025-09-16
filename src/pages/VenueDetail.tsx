import { useParams } from "react-router-dom";
import { useVenue } from "@/features/venues/hooks";
import { VenueGallery } from "@/features/venues/VenueGallery";
import { BookingWidget } from "@/features/bookings/BookingWidget";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

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
      </section>

      {/* Right column */}
      <aside className="md:pl-2">
        <h1 className="text-3xl font-semibold">{venue.name}</h1>
        <h2 className="text-2xl font-medium">{locLine}</h2>
        <div className="flex flex-wrap gap-2 my-2">
          <Badge variant="secondary">Guests {venue.maxGuests}</Badge>
          {venue.meta?.parking && <Badge variant="secondary">Parking</Badge>}
          {venue.meta?.wifi && <Badge variant="secondary">WiFi</Badge>}
          {venue.meta?.pets && <Badge variant="secondary">Pets</Badge>}
          {venue.meta?.breakfast && (
            <Badge variant="secondary">Breakfast</Badge>
          )}
        </div>
        {/* Rating */}
        {venue.rating !== undefined && (
          <div className="flex gap-1 items-center font-semibold my-2 ml-auto">
            <p>
              {venue.rating == 0 ? "No ratings" : venue.rating!.toPrecision(2)}
            </p>
            <Star
              className={
                venue.rating! >= 1 ? "text-yellow-500" : "text-muted-foreground"
              }
            />
          </div>
        )}
        {/* Owner */}
        {venue.owner?.name && (
          <div className="flex items-center gap-3">
            {venue.owner.avatar?.url ? (
              <img
                src={venue.owner.avatar.url}
                alt={venue.owner.avatar.alt || venue.owner.name}
                className="h-12 w-12 rounded-full bg-neutral-100 p-2 object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-muted" />
            )}
            <div className="text-sm">
              <span className="font-medium text-sky-800">
                {venue.owner.name}
              </span>{" "}
              <span className="font-semibold">is the owner</span>
            </div>
          </div>
        )}
        <article className="prose max-w-none">
          <p className="font-light">{venue.description}</p>
        </article>
        <div className="sticky top-20">
          <BookingWidget
            venueId={venue.id}
            price={venue.price}
            maxGuests={venue.maxGuests}
            bookings={(venue.bookings ?? []).map((b) => ({
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
