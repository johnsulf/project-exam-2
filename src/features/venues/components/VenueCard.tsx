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
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border bg-card transition duration-300 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative h-56 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-sm font-medium text-slate-600">
            No image available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute left-4 bottom-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-slate-900 shadow-sm backdrop-blur">
            <MapPin className="size-3.5" aria-hidden="true" />
            {locationLabel}
          </span>
        </div>
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur">
          <Star
            className={showStar ? "size-3.5 text-yellow-500" : "size-3.5"}
            aria-hidden="true"
          />
          <span>{rating ? rating.toPrecision(2) : "No ratings"}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">
              {v.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {v.description}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">From</p>
            <p className="text-base font-semibold text-slate-900">
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

        <div className="mt-auto flex items-center justify-between pt-2 text-sm font-medium text-primary transition group-hover:text-primary/80">
          <span>View details</span>
          <ArrowRight className="size-4 transition duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
