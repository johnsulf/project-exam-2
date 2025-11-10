import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { formatDateRange, nightsBetween } from "@/lib/date";

type Props = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  venue?: { id: string; name: string; media?: { url: string; alt?: string }[] };
  children?: ReactNode;
};

export function BookingCard({
  id,
  dateFrom,
  dateTo,
  guests,
  venue,
  children,
}: Props) {
  const vId = venue?.id;
  const vName = venue?.name ?? "Venue";
  const img = venue?.media?.[0]?.url;
  const from = new Date(dateFrom);
  const to = new Date(dateTo);
  const nights = nightsBetween(from, to);
  const titleId = `booking-${id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className="rounded-lg border overflow-hidden bg-card"
    >
      <div className="flex flex-col sm:flex-row">
        <div
          className="bg-muted h-44 w-full sm:h-auto sm:w-48"
          aria-hidden={!img}
        >
          {img ? (
            <img
              src={img}
              alt={venue?.media?.[0]?.alt || vName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full grid place-items-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <header>
            <h3
              id={titleId}
              className="text-lg font-semibold leading-snug text-balanced"
            >
              {vName}
            </h3>
          </header>
          <p className="text-sm text-muted-foreground">
            {formatDateRange(from, to)} • {nights}{" "}
            {nights === 1 ? "night" : "nights"}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Guests {guests}</Badge>
            <Badge variant="outline">Booking #{id.slice(0, 8)}</Badge>
          </div>
          {vId && (
            <Link
              to={`/venues/${vId}`}
              className="text-sm font-medium text-primary underline-offset-4 hover:underline my-2"
            >
              View venue <span className="sr-only">“{vName}”</span>
            </Link>
          )}
          {children ? (
            <div className="pt-2 border-t border-border/70">{children}</div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
