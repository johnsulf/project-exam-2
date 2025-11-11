import { useParams, Link } from "react-router-dom";
import { useVenue } from "@/features/venues/hooks";
import { useVenueBookings } from "@/features/venues/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateRange, nightsBetween } from "@/lib/date";
import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ManageVenueBookings() {
  const { id } = useParams<{ id: string }>();

  const { data: venue, isLoading: vLoading } = useVenue(id);

  const { data: bookings, isLoading, isError } = useVenueBookings(id);

  const baseBreadcrumbs = [
    { label: "Home", to: "/" },
    { label: "Manage", to: "/manage" },
    { label: "Bookings" },
  ];

  if (isLoading || vLoading) {
    return (
      <div className="space-y-4">
        <PageBreadcrumbs items={baseBreadcrumbs} />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !bookings) {
    return (
      <div className="space-y-4">
        <PageBreadcrumbs items={baseBreadcrumbs} />
        <h1>Venue bookings</h1>
        <p className="text-destructive">Couldn’t load bookings.</p>
        <Button asChild variant="outline">
          <Link to="/manage">Back to Manage</Link>
        </Button>
      </div>
    );
  }

  const name = venue?.name ?? "Venue";

  const rows = bookings
    .slice()
    .sort(
      (a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime(),
    );

  return (
    <div className="space-y-4">
      <PageBreadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Manage", to: "/manage" },
          venue?.id
            ? { label: venue.name ?? "Venue", to: `/manage/${venue.id}` }
            : { label: venue?.name ?? "Venue" },
          { label: "Bookings" },
        ]}
      />
      <header className="flex items-center justify-between">
        <div>
          <h1>Bookings</h1>
          <p>{name}</p>
        </div>
        {venue?.id && (
          <Button asChild variant="outline">
            <Link to={`/venues/${venue.id}`}>View venue</Link>
          </Button>
        )}
      </header>

      <Card>
        <CardHeader>
          <CardTitle>
            {rows.length} {rows.length === 1 ? "booking" : "bookings"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead>Dates</TableHead>
                  <TableHead>Nights</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Customer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((b) => {
                  const from = new Date(b.dateFrom);
                  const to = new Date(b.dateTo);
                  const nights = nightsBetween(from, to);
                  const customerName = b.customer?.name ?? "-";
                  return (
                    <TableRow key={b.id} className="border-b last:border-0">
                      <TableCell>{formatDateRange(from, to)}</TableCell>
                      <TableCell>{nights}</TableCell>
                      <TableCell>{b.guests}</TableCell>
                      <TableCell>{customerName}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
