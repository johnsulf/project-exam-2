import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateRange, nightsBetween } from "@/lib/date";

type Props = {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  venue?: { id: string; name: string; media?: { url: string; alt?: string }[] };
};

export function BookingCard({ id, dateFrom, dateTo, guests, venue }: Props) {
  const vId = venue?.id;
  const vName = venue?.name ?? "Venue";
  const img = venue?.media?.[0]?.url;
  const from = new Date(dateFrom);
  const to = new Date(dateTo);
  const nights = nightsBetween(from, to);

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-[140px_1fr]">
        <div className="bg-muted h-full">
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
        <div>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{vName}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="text-sm text-muted-foreground">
              {formatDateRange(from, to)} • {nights}{" "}
              {nights === 1 ? "night" : "nights"}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Guests {guests}</Badge>
              <Badge variant="outline">Booking #{id.slice(0, 8)}</Badge>
            </div>
            {vId && (
              <div className="pt-1">
                <Link to={`/venues/${vId}`} className="underline text-sm">
                  View venue
                </Link>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
