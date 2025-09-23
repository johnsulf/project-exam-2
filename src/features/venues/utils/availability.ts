type Bookable = {
  bookings?: { dateFrom: string; dateTo: string }[];
  _bookings?: { dateFrom: string; dateTo: string }[];
};

export function rangesOverlap(aFrom: Date, aTo: Date, bFrom: Date, bTo: Date) {
  return aFrom < bTo && bFrom < aTo;
}

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
