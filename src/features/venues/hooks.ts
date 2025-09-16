import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { getVenueById, listVenues, createBooking } from "@/lib/endpoints";

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
    },
  });
}
