import { getEnvelope, getJson, postJson, putJson } from "@/lib/api";
import type {
  Booking,
  BookingWithVenue,
  Profile,
  Venue as ApiVenue,
} from "@/types/api";
import {
  Venue as VenueSchema,
  type TVenue,
  type TVenueCreate,
  type TVenueUpdate,
} from "@/types/schemas";

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

type VenueParams = {
  page?: number;
  limit?: number;
  q?: string;
  _owner?: boolean;
  _bookings?: boolean;
};

type ProfileVenuesParams = {
  page?: number;
  limit?: number;
  sort?: string;
  _bookings?: boolean;
};

// List venues
export async function listVenues(
  params: VenueParams = {},
  signal?: AbortSignal,
) {
  const { q, ...rest } = params;

  const query: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rest)) {
    if (v !== undefined && v !== null) query[k] = v;
  }
  if (q && q.trim()) query.q = q.trim();

  const path = q && q.trim() ? "/venues/search" : "/venues";
  return getEnvelope<ApiVenue[]>(path, query, signal);
}

// Single venue by id
export async function getVenueById(
  id: string,
  opts?: { _owner?: boolean; _bookings?: boolean },
  signal?: AbortSignal,
) {
  const raw = await getJson<unknown>(`/venues/${id}`, opts, signal);
  return VenueSchema.parse(raw);
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

// Get bookings by profile
export async function getBookingsByProfile(
  name: string,
  opts?: { _venue?: boolean; page?: number; limit?: number },
  signal?: AbortSignal,
) {
  return getEnvelope<BookingWithVenue[]>(
    `/profiles/${encodeURIComponent(name)}/bookings`,
    { _venue: true, ...(opts ?? {}) },
    signal,
  );
}

// Get venues by profile
export async function getVenuesByProfile(
  name: string,
  params: ProfileVenuesParams = {},
  signal?: AbortSignal,
) {
  // GET /holidaze/profiles/:name/venues
  return getEnvelope<TVenue[]>(
    `/profiles/${encodeURIComponent(name)}/venues`,
    params,
    signal,
  );
}

// Create venue
export async function createVenue(body: TVenueCreate) {
  return postJson<ApiVenue, TVenueCreate>("/venues", body);
}

// Update venue
export async function updateVenue(id: string, patch: TVenueUpdate) {
  return putJson<ApiVenue, TVenueUpdate>(`/venues/${id}`, patch);
}
