import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useVenue } from "@/features/venues/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { formatDateRange } from "@/lib/date";
import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteVenue } from "@/features/manager/hooks";
import { ManageVenueDetailSkeleton } from "@/components/skeletons/ManageVenueDetailSkeleton";

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
  const navigate = useNavigate();
  const { data: v, isLoading, isError } = useVenue(id);

  const baseBreadcrumbs = [
    { label: "Home", to: "/" },
    { label: "Manage", to: "/manage" },
    { label: "Venue" },
  ];

  if (isLoading)
    return (
      <div className="space-y-6">
        <PageBreadcrumbs items={baseBreadcrumbs} />
        <ManageVenueDetailSkeleton />
      </div>
    );
  if (isError || !v) {
    return (
      <div className="space-y-3">
        <PageBreadcrumbs items={baseBreadcrumbs} />
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
      <PageBreadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Manage", to: "/manage" },
          { label: v.name },
        ]}
      />
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
          <DeleteVenueDialog
            venueId={v.id}
            venueName={v.name}
            onDeleted={() => navigate("/manage", { replace: true })}
          />
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
            <div className="rounded-lg border p-3">
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
                      {b.customer?.name ? ` - ${b.customer.name}` : ""}
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

type DeleteVenueDialogProps = {
  venueId: string;
  venueName: string;
  onDeleted: () => void;
};

function DeleteVenueDialog({
  venueId,
  venueName,
  onDeleted,
}: DeleteVenueDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useDeleteVenue(venueId);

  async function handleDelete() {
    await mutateAsync();
    setOpen(false);
    onDeleted();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete venue</DialogTitle>
          <DialogDescription>
            You're about to permanently delete{" "}
            <span className="font-medium">{venueName}</span>. This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending && <Spinner className="mr-2" aria-hidden="true" />}
            {isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
