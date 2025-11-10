import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/money";
import type { Venue } from "@/types/api";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

export function VenueCard({ v }: { v: Venue }) {
  const firstMedia = v.media?.[0];
  const imageUrl = firstMedia?.url;
  const imageAlt = firstMedia?.alt || `Image of ${v.name}`;
  const rating =
    typeof v.rating === "number" && !Number.isNaN(v.rating) ? v.rating : null;
  const showStar = rating !== null && rating > 0;
  const locationLabel =
    v.location?.city && v.location?.country
      ? `${v.location.city}, ${v.location.country}`
      : (v.location?.city ?? v.location?.country ?? "Worldwide");

  return (
    <Link
      to={`/venues/${v.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative h-56 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-neutral-200 via-neutral-300 to-neutral-400 text-sm font-medium text-muted-foreground">
            No image available
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute left-4 bottom-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-card/85 px-2 py-1 text-xs font-medium text-muted-foreground">
            <MapPin className="size-4" aria-hidden="true" />
            {locationLabel}
          </span>
        </div>
        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-card/85 px-2 py-1 text-xs font-semibold text-muted-foreground">
          <Star
            className={showStar ? "size-4 text-yellow-500" : "size-4"}
            aria-hidden="true"
          />
          <span>{rating ? rating.toPrecision(2) : "No ratings"}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-muted-foreground">
              {v.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {v.description}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">From</p>
            <p className="font-semibold">
              {formatMoney(v.price, { currency: "USD" })}{" "}
              <span className="text-xs text-muted-foreground">/ night</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
          <Badge variant="secondary">Up to {v.maxGuests} guests</Badge>
          {v.meta?.wifi && <Badge variant="secondary">WiFi</Badge>}
          {v.meta?.parking && <Badge variant="secondary">Parking</Badge>}
          {v.meta?.pets && <Badge variant="secondary">Pets welcome</Badge>}
          {v.meta?.breakfast && <Badge variant="secondary">Breakfast</Badge>}
        </div>

        <div className="mt-auto flex items-center justify-between py-2 text-sm font-medium text-primary transition group-hover:text-primary/85">
          <span>View details</span>
          <ArrowRight className="size-4 transition duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
