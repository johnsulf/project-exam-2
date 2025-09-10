import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { listVenues, getVenueById } from "@/lib/endpoints";
import type { Envelope, PageMeta, Venue } from "@/types/api";

export function useVenues(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: qk.venuesPage(params),
    queryFn: ({ signal }) => listVenues(params, signal),
    select: (res: Envelope<Venue[]> & { meta?: PageMeta }) => res,
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
