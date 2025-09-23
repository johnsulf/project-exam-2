import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";
import type { Venue } from "@/types/api";
import { Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function VenueCard({ v }: { v: Venue }) {
  const firstMedia = v.media?.[0];
  const imageUrl = firstMedia?.url;
  const imageAlt = firstMedia?.alt || `Image of ${v.name}`;
  const r =
    typeof v.rating === "number" && !Number.isNaN(v.rating) ? v.rating : null;
  const showStar = r !== null && r >= 1;

  return (
    <div className="rounded-md shadow border p-2 grid gap-2 bg-white">
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
            {v.location.city}, {v.location.country}
          </div>
        )}
        <div className="flex gap-1 items-center text-sm font-semibold ml-auto">
          <Star
            className={showStar ? "text-yellow-500" : "text-muted-foreground"}
          />
          <p>{r ? r.toPrecision(2) : "No ratings"}</p>
        </div>
      </div>

      <h3>{v.name}</h3>

      <div className="flex gap-1 flex-wrap">
        <Badge variant="secondary">Guests: {v.maxGuests}</Badge>
        {v.meta?.parking && <Badge variant="secondary">Parking</Badge>}
        {v.meta?.wifi && <Badge variant="secondary">WiFi</Badge>}
        {v.meta?.pets && <Badge variant="secondary">Pets</Badge>}
        {v.meta?.breakfast && <Badge variant="secondary">Breakfast</Badge>}
      </div>

      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold">
          {formatMoney(v.price, { currency: "USD" })} / night
        </p>
        <Button asChild>
          <Link to={`/venues/${v.id}`}>
            More details <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );
}
