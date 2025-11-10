import { getEnvelope, getJson, postJson, putJson, deleteJson } from "@/lib/api";
import type {
  Booking,
  BookingWithVenue,
  PageMeta,
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

/**
 * Fetches venues while eagerly walking the pagination cursor until every page has been merged.
 *
 * Useful when the UI applies client-side filtering/sorting and needs the entire dataset up front.
 *
 * @param params - Base query parameters passed to the API. `page` is used as the initial cursor.
 * @param signal - Optional abort signal so callers can cancel long-running multi-page fetches.
 * @returns The first page envelope with `data` replaced by the aggregated venue list.
 */
export async function listAllVenues(
  params: VenueParams = {},
  signal?: AbortSignal,
) {
  const firstPage = await listVenues(params, signal);
  const meta = (firstPage.meta ?? {}) as Partial<PageMeta>;
  const startPage = meta.currentPage ?? params.page ?? 1;

  const combined = [...firstPage.data];
  const visitedPages = new Set<number>([startPage]);

  let nextPage =
    meta.nextPage ??
    (meta.pageCount && startPage < meta.pageCount ? startPage + 1 : null);

  while (nextPage && !visitedPages.has(nextPage) && !signal?.aborted) {
    visitedPages.add(nextPage);

    const next = await listVenues({ ...params, page: nextPage }, signal);
    combined.push(...next.data);

    const nextMeta = (next.meta ?? {}) as Partial<PageMeta>;
    nextPage =
      nextMeta.nextPage ??
      (nextMeta.pageCount && nextPage < nextMeta.pageCount
        ? nextPage + 1
        : null);
  }

  return { ...firstPage, data: combined };
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

// Delete venue
export async function deleteVenue(id: string) {
  return deleteJson<{ data: { id: string } }>(`/venues/${id}`);
}
