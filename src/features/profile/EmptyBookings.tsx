type EmptyBookingsProps = {
  message?: string;
};

export function EmptyBookings({
  message = "No upcoming bookings yet. Find a venue you like and book your stay.",
}: EmptyBookingsProps) {
  return (
    <div className="rounded-md border p-6 text-sm text-muted-foreground">
      {message}
    </div>
  );
}
