import { getEnvelope, getJson } from "@/lib/api";
import { Envelope, PageMeta, Venue } from "@/types/schemas";
import z from "zod";

// List venues
export async function listVenues(
  params?: Record<string, unknown>,
  signal?: AbortSignal,
) {
  const env = await getEnvelope<unknown>("/venues", params, signal);
  const parsed = Envelope(z.array(Venue)).parse(env);
  const meta = PageMeta.parse(env.meta);
  return { ...parsed, meta };
}

// Single venue by id
export async function getVenueById(
  id: string,
  opts?: { _owner?: boolean; _bookings?: boolean },
  signal?: AbortSignal,
) {
  const raw = await getJson<unknown>(`/venues/${id}`, opts, signal);
  return Venue.parse(raw);
}
