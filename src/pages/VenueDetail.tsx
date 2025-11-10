import { type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useVenue } from "@/features/venues/hooks";
import { VenueGallery } from "@/features/venues/VenueGallery";
import { BookingWidget } from "@/features/bookings/BookingWidget";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";
import { routes } from "@/router/routes";
import { VenueDetailSkeleton } from "@/components/skeletons/VenueDetailSkeleton";

export default function VenueDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: venue, isLoading, isError } = useVenue(id);

  const breadcrumbs = [
    { label: "Home", to: routes.home },
    { label: "Venues", to: routes.venues },
    { label: venue?.name ?? "Venue" },
  ];

  let content: ReactNode;

  if (isLoading) {
    content = <VenueDetailSkeleton />;
  } else if (isError || !venue) {
    content = <p className="text-destructive">Couldn’t load venue.</p>;
  } else {
    const city = venue.location?.city;
    const country = venue.location?.country;
    const locLine = city && country ? `${city}, ${country}` : undefined;

    content = (
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
          <h1 className="text-4xl font-semibold">{venue.name}</h1>
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
            <div className="flex gap-2 items-center font-semibold my-2 ml-auto">
              <p>
                {venue.rating == 0
                  ? "No ratings"
                  : venue.rating!.toPrecision(2)}
              </p>
              <Star
                className={
                  venue.rating! >= 1
                    ? "text-yellow-500"
                    : "text-muted-foreground"
                }
              />
            </div>
          )}
          {/* Owner */}
          {venue.owner?.name && (
            <div className="flex items-center gap-2">
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
                <span className="font-medium text-teal-600">
                  {venue.owner.name}
                </span>
                <span>&nbsp;is the owner</span>
              </div>
            </div>
          )}
          <article className="prose max-w-none my-4">
            <p className="font-light">{venue.description}</p>
          </article>
          <BookingWidget
            venueId={venue.id}
            price={venue.price}
            maxGuests={venue.maxGuests}
            bookings={(venue.bookings ?? []).map((b) => ({
              dateFrom: b.dateFrom,
              dateTo: b.dateTo,
            }))}
          />
        </aside>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumbs items={breadcrumbs} />
      {content}
    </div>
  );
}
