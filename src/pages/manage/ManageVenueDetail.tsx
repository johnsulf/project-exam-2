import { Link, useParams } from "react-router-dom";
import { useVenue } from "@/features/venues/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { formatDateRange } from "@/lib/date";

function computeStatus(bookings?: { dateFrom: string; dateTo: string }[]) {
  const now = Date.now();
  const hasUpcoming = (bookings ?? []).some(
    (b) => new Date(b.dateTo).getTime() > now,
  );
  return hasUpcoming
    ? { label: "Has upcoming bookings", variant: "default" as const }
    : { label: "No upcoming bookings", variant: "secondary" as const };
}

export default function ManageVenueDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: v, isLoading, isError } = useVenue(id);

  if (isLoading) return <DetailSkeleton />;
  if (isError || !v) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Venue</h1>
        <p className="text-destructive">Couldn’t load venue.</p>
        <Button asChild variant="outline">
          <Link to="/manage">Back to Manage</Link>
        </Button>
      </div>
    );
  }

  const status = computeStatus(v.bookings);
  const firstImage = v.media?.[0]?.url;

  const disabledRanges = (v.bookings ?? []).map((b) => {
    const from = new Date(b.dateFrom);
    const to = new Date(b.dateTo);
    const toInclusive = new Date(to);
    toInclusive.setDate(toInclusive.getDate() - 1);
    return { from, to: toInclusive };
  });

  const defaultMonth = disabledRanges[0]?.from ?? new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{v.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant={status.variant}>{status.label}</Badge>
            <Badge variant="secondary">Guests {v.maxGuests}</Badge>
            {v.meta?.wifi && <Badge variant="secondary">WiFi</Badge>}
            {v.meta?.parking && <Badge variant="secondary">Parking</Badge>}
            {v.meta?.pets && <Badge variant="secondary">Pets</Badge>}
            {v.meta?.breakfast && <Badge variant="secondary">Breakfast</Badge>}
            {v.location?.city || v.location?.country ? (
              <span className="text-sm text-muted-foreground">
                {v.location?.city ?? ""}
                {v.location?.city && v.location?.country ? ", " : ""}
                {v.location?.country ?? ""}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/venues/${v.id}`}>View</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={`/manage/${v.id}/edit`}>Edit</Link>
          </Button>
          <Button asChild variant="destructive">
            <Link to={`/manage/${v.id}/delete`}>Delete</Link>
          </Button>
        </div>
      </header>

      {/* Image + Booked dates side by side on desktop */}
      <section className="flex flex-col gap-6 md:grid md:grid-cols-2">
        <div>
          {firstImage ? (
            <img
              src={firstImage}
              alt={v.media?.[0]?.alt || v.name}
              className="w-full h-56 md:h-full object-cover rounded"
            />
          ) : (
            <div className="h-56 grid place-items-center text-sm text-muted-foreground border rounded">
              No image
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Booked dates</h2>
          {(v.bookings?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings yet.</p>
          ) : (
            <div className="rounded-xl border p-3">
              <div className="flex justify-center ">
                <Calendar
                  mode="single"
                  numberOfMonths={2}
                  defaultMonth={defaultMonth}
                  disabled={disabledRanges}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Booked ranges are disabled in the calendar.
              </p>
              <ul className="mt-3 text-sm grid gap-1">
                {v.bookings!.map((b) => {
                  const f = new Date(b.dateFrom);
                  const t = new Date(b.dateTo);
                  return (
                    <li key={b.id} className="text-muted-foreground">
                      {formatDateRange(f, t)} • {b.guests} guest
                      {b.guests === 1 ? "" : "s"}
                      {b.customer?.name ? ` — ${b.customer.name}` : ""}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-6">
        <Skeleton className="h-56 w-full rounded-xl" />
        <div className="space-y-4 mt-6 md:mt-0">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
