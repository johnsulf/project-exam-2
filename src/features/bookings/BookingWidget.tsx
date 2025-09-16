import { useState, useMemo } from "react";
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
  const { token } = useAuth();

  const disabledSet = useMemo(() => buildDisabledDates(bookings), [bookings]);
  const today = new Date();

  const nights =
    range?.from && range?.to ? nightsBetween(range.from, range.to) : 0;
  const total = nights * price;

  const { mutateAsync, isPending } = useCreateBooking(venueId);

  async function submit() {
    if (!token) {
      toast.info("Please sign in to book.");
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
    try {
      await mutateAsync({
        dateFrom: toISODate(range.from),
        dateTo: toISODate(range.to), // checkout day
        guests,
      });
      toast.success("Booking confirmed!");
      setRange(undefined);
      setGuests(1);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Booking failed");
    }
  }

  const disabledFn = (day: Date) =>
    disabledSet.has(toISODate(day)) || day < new Date(today.toDateString());

  return (
    <aside className="rounded-xl border p-4 space-y-4 w-full md:w-[360px]">
      <div>
        <div className="text-xl font-semibold">
          {formatMoney(price, { currency: "USD" })}{" "}
          <span className="text-sm font-normal">/ night</span>
        </div>
      </div>

      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={1}
        disabled={disabledFn}
        initialFocus
      />

      <div className="flex items-center justify-between">
        <span className="text-sm">Guests</span>
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

      <div className="rounded-md bg-muted p-3 text-sm">
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
        onClick={submit}
        disabled={!range?.from || !range?.to || isPending || !token}
      >
        {token ? (isPending ? "Booking…" : "Book now") : "Sign in to book"}
      </Button>

      <p className="text-xs text-muted-foreground">Max guests: {maxGuests}</p>
    </aside>
  );
}
