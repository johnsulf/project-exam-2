import { getEnvelope, getJson } from "@/lib/api";
import type { Envelope, PageMeta, Venue } from "@/types/api";

// List venues
export async function listVenues(params?: Record<string, unknown>) {
  return getEnvelope<Venue[]>("/venues", params) as Promise<
    Envelope<Venue[]> & { meta?: PageMeta }
  >;
}

// Single venue by id
export async function getVenueById(
  id: string,
  opts?: { _owner?: boolean; _bookings?: boolean },
) {
  return getJson<Venue>(`/venues/${id}`, opts);
}
