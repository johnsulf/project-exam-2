import { getEnvelope, getJson, postJson, putJson } from "@/lib/api";
import type { Booking, Profile } from "@/types/api";
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

type ProfilePatch = {
  bio?: string | null;
  avatar?: { url: string; alt?: string | null };
  banner?: { url: string; alt?: string | null };
  venueManager?: boolean;
};

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

// Get profile by name
export async function getProfile(
  name: string,
  opts?: { _bookings?: boolean; _venues?: boolean },
  signal?: AbortSignal,
) {
  // /holidaze/profiles/<name>?_bookings=true&_venues=true
  return getJson<Profile>(
    `/profiles/${encodeURIComponent(name)}`,
    opts,
    signal,
  );
}

// Update profile by name
export async function updateProfile(name: string, patch: ProfilePatch) {
  // PUT /holidaze/profiles/<name>
  return putJson<Profile, ProfilePatch>(
    `/profiles/${encodeURIComponent(name)}`,
    patch,
  );
}
