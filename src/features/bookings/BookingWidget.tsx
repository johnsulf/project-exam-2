import { useId, useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { type DateRange } from "react-day-picker";
import {
  buildDisabledDates,
  toISODate,
  formatDateRange,
  nightsBetween,
} from "@/lib/date";
import { formatMoney } from "@/lib/money";
import { useAuth } from "@/features/auth/store";
import { useCreateBooking } from "@/features/venues/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "@/router/routes";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  venueId: string;
  price: number;
  maxGuests: number;
  bookings?: Array<{ dateFrom: string; dateTo: string }>;
};

export function BookingWidget({
  venueId,
  price,
  maxGuests,
  bookings = [],
}: Props) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const disabledSet = useMemo(() => buildDisabledDates(bookings), [bookings]);
  const today = new Date();

  const nights =
    range?.from && range?.to ? nightsBetween(range.from, range.to) : 0;
  const total = nights * price;

  const { mutateAsync, isPending } = useCreateBooking(venueId);

  function handlePrimaryAction() {
    if (!token) {
      navigate(routes.auth.login, { state: { from: location } });
      return;
    }
    if (!range?.from || !range?.to) {
      toast.error("Pick your dates first.");
      return;
    }
    if (guests < 1 || guests > maxGuests) {
      toast.error(`Guests must be between 1 and ${maxGuests}.`);
      return;
    }
    setConfirmOpen(true);
  }

  async function confirmBooking() {
    if (!range?.from || !range?.to) return;
    try {
      await mutateAsync({
        dateFrom: toISODate(range.from),
        dateTo: toISODate(range.to),
        guests,
      });
      toast.success("Booking confirmed!");
      setRange(undefined);
      setGuests(1);
      setConfirmOpen(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Booking failed");
    }
  }

  const disabledFn = (day: Date) =>
    disabledSet.has(toISODate(day)) || day < new Date(today.toDateString());

  const headingId = useId();
  const summaryId = useId();

  return (
    <section
      aria-labelledby={headingId}
      aria-describedby={summaryId}
      className="rounded-xl border p-4 space-y-4 w-full md:w-[360px]"
    >
      <div className="space-y-1">
        <h2 id={headingId} className="text-xl font-semibold">
          Book this venue
        </h2>
        <p className="text-base">
          {formatMoney(price, { currency: "USD" })}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            per night
          </span>
        </p>
      </div>

      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={1}
        disabled={disabledFn}
        className="self-center"
      />

      <div className="flex items-center justify-between">
        <div>
          <p>Guests</p>

          <p className="text-xs text-muted-foreground">
            Max guests: {maxGuests}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            aria-label="Decrease guests"
          >
            −
          </Button>
          <span className="w-6 text-center">{guests}</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))}
            aria-label="Increase guests"
          >
            +
          </Button>
        </div>
      </div>

      <div className="rounded-lg bg-muted p-3 text-sm" id={summaryId}>
        {range?.from && range?.to ? (
          <>
            <div>{formatDateRange(range.from, range.to)}</div>
            <div className="flex justify-between mt-1">
              <span>
                {nights} {nights === 1 ? "night" : "nights"}
              </span>
              <span className="font-medium">
                {formatMoney(total, { currency: "USD" })}
              </span>
            </div>
          </>
        ) : (
          <div>Select dates to see the price.</div>
        )}
      </div>

      <Button
        className="w-full"
        onClick={handlePrimaryAction}
        disabled={isPending || (!!token && (!range?.from || !range?.to))}
        aria-busy={isPending}
      >
        {token && isPending && <Spinner className="mr-2" aria-hidden="true" />}
        {token ? (isPending ? "Booking…" : "Book now") : "Sign in to book"}
      </Button>

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!isPending) setConfirmOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm booking</DialogTitle>
            <DialogDescription>
              Review your stay details before confirming.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Dates</span>
              <span className="font-medium">
                {range?.from && range?.to
                  ? formatDateRange(range.from, range.to)
                  : "Select dates"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Guests</span>
              <span className="font-medium">{guests}</span>
            </div>
            <div className="flex justify-between">
              <span>
                {nights} {nights === 1 ? "night" : "nights"}
              </span>
              <span className="font-semibold">
                {formatMoney(total, { currency: "USD" })}
              </span>
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmBooking}
              disabled={isPending}
              aria-busy={isPending}
            >
              {isPending && <Spinner className="mr-2" aria-hidden="true" />}
              Confirm booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
