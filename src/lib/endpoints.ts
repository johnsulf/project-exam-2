import { getEnvelope, getJson } from "@/lib/api";
import type { Envelope, PageMeta, Venue } from "@/types/api";

// List venues
export async function listVenues(
  params?: Record<string, unknown>,
  signal?: AbortSignal,
) {
  return getEnvelope<Venue[]>("/venues", params, signal) as Promise<
    Envelope<Venue[]> & { meta?: PageMeta }
  >;
}

// Single venue by id
export async function getVenueById(
  id: string,
  opts?: { _owner?: boolean; _bookings?: boolean },
  signal?: AbortSignal,
) {
  return getJson<Venue>(`/venues/${id}`, opts, signal);
}
