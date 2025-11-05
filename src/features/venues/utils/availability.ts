type Bookable = {
  bookings?: { dateFrom: string; dateTo: string }[];
  _bookings?: { dateFrom: string; dateTo: string }[];
};

/**
 * Determines whether two date ranges overlap.
 * @param aFrom - Start date of range A (inclusive).
 * @param aTo - End date of range A (exclusive).
 * @param bFrom - Start date of range B (inclusive).
 * @param bTo - End date of range B (exclusive).
 * @returns True when the ranges overlap in time.
 */
export function rangesOverlap(aFrom: Date, aTo: Date, bFrom: Date, bTo: Date) {
  return aFrom < bTo && bFrom < aTo;
}

/**
 * Checks if a venue is available within the provided date range.
 * @param v - Venue-like object containing bookings or prefetched `_bookings`.
 * @param from - Desired check-in date.
 * @param to - Desired check-out date.
 * @returns True when no existing bookings overlap the requested interval.
 */
export function isVenueAvailable(v: Bookable, from?: Date, to?: Date) {
  if (!from || !to) return true;
  const bookings = v._bookings ?? v.bookings ?? [];
  if (!Array.isArray(bookings) || bookings.length === 0) return true;

  return bookings.every((b) => {
    const bf = new Date(b.dateFrom);
    const bt = new Date(b.dateTo);
    return !rangesOverlap(from, to, bf, bt);
  });
}
