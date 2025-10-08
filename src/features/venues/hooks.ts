import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { getVenueById, listVenues, createBooking } from "@/lib/endpoints";
import type { TBookingWithCustomer } from "@/types/schemas";
import { useQueryErrorToast } from "@/lib/queryToasts";
import { getErrorMessage } from "@/lib/errors";

export function useVenues(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: qk.venuesPage(params),
    queryFn: ({ signal }) => listVenues(params, signal),
    placeholderData: (prev) => prev,
  });
}

export function useVenue(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: id ? qk.venue(id) : qk.venues(),
    queryFn: ({ signal }) =>
      getVenueById(id!, { _owner: true, _bookings: true }, signal),
  });
}

export function useCreateBooking(venueId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { dateFrom: string; dateTo: string; guests: number }) =>
      createBooking({ ...input, venueId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.venue(venueId) }); // refresh disabled days
      qc.invalidateQueries({ queryKey: qk.venueBookings(venueId) }); // refresh bookings list
    },
  });
}

export function useVenueBookings(venueId?: string) {
  const q = useQuery<TBookingWithCustomer[]>({
    enabled: !!venueId,
    queryKey: venueId ? qk.venueBookings(venueId) : ["venue", "bookings"],
    queryFn: async ({ signal }) => {
      const v = await getVenueById(
        venueId!,
        { _bookings: true, _owner: true },
        signal,
      );
      return v.bookings ?? [];
    },
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });
  useQueryErrorToast(q, (e) => `Couldn't load bookings: ${getErrorMessage(e)}`);
  return q;
}
