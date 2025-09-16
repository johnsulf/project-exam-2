import { getEnvelope, getJson, postJson } from "@/lib/api";
import type { Booking } from "@/types/api";
import { Envelope, PageMeta, Venue } from "@/types/schemas";
import z from "zod";

export interface VenueQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  _owner?: boolean;
  _bookings?: boolean;
  [key: string]: unknown;
}

// List venues
export async function listVenues(
  params?: VenueQueryParams,
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

// Create a booking
export async function createBooking(body: {
  dateFrom: string;
  dateTo: string;
  guests: number;
  venueId: string;
}) {
  return postJson<Booking, typeof body>("/bookings", body);
}
