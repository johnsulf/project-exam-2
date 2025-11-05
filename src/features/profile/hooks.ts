import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import {
  getBookingsByProfile,
  getProfile,
  updateProfile,
  updateVenue,
} from "@/lib/endpoints";
import { useAuth } from "../auth/store";
import { getErrorMessage } from "@/lib/errors";
import { useQueryErrorToast } from "@/lib/queryToasts";
import type { Profile } from "@/types/api";
import type { TBookingWithVenue } from "@/types/schemas";

/**
 * Fetches and subscribes to profile data for the provided user name.
 * @param name - Profile name (Noroff username/email prefix). Query is skipped when falsy.
 */
export function useProfile(name?: string) {
  const q = useQuery({
    enabled: !!name,
    queryKey: name ? qk.profile(name) : ["profile"],
    queryFn: ({ signal }) =>
      getProfile(name!, { _bookings: false, _venues: false }, signal),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
  useQueryErrorToast(
    q,
    (e) => `Couldn't load your profile: ${getErrorMessage(e)}`,
  );
  return q;
}

/**
 * Returns a mutation that updates the specified profile and keeps the cache in sync.
 * @param name - Profile name that should be updated.
 */
export function useUpdateProfile(name: string) {
  const qc = useQueryClient();
  const { setProfile } = useAuth.getState();

  return useMutation({
    mutationFn: (
      patch: Partial<Profile> & {
        bio?: string | null;
        avatar?: { url: string; alt?: string | null };
        banner?: { url: string; alt?: string | null };
        venueManager?: boolean;
      },
    ) => updateProfile(name, patch),
    onSuccess(updated) {
      qc.setQueryData(qk.profile(name), updated);
      setProfile(updated);
    },
  });
}

type ProfileBookingGroups = {
  upcoming: TBookingWithVenue[];
  past: TBookingWithVenue[];
};

/**
 * Fetches bookings grouped into upcoming and past arrays for a profile.
 * @param name - Profile name whose bookings should be retrieved.
 */
export function useProfileBookings(name?: string) {
  const q = useQuery({
    enabled: !!name,
    queryKey: name ? qk.bookingsByProfile(name) : ["bookings", "profile"],
    queryFn: ({ signal }) =>
      getBookingsByProfile(name!, { _venue: true }, signal),
    select: (env): { data: ProfileBookingGroups; meta: typeof env.meta } => {
      const now = Date.now();
      const source = env.data ?? [];

      const upcoming: TBookingWithVenue[] = [];
      const past: TBookingWithVenue[] = [];

      for (const booking of source) {
        const normalized: TBookingWithVenue = booking.venue
          ? {
              ...booking,
              venue: {
                ...booking.venue,
                rating: booking.venue.rating ?? 0,
              },
            }
          : (booking as TBookingWithVenue);

        const dateTo = new Date(normalized.dateTo).getTime();
        if (dateTo >= now) {
          upcoming.push(normalized);
        } else {
          past.push(normalized);
        }
      }

      upcoming.sort(
        (a, b) =>
          new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime(),
      );
      past.sort(
        (a, b) => new Date(b.dateTo).getTime() - new Date(a.dateTo).getTime(),
      );

      return { data: { upcoming, past }, meta: env.meta };
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
  useQueryErrorToast(q, (e) => `Couldn't load bookings: ${getErrorMessage(e)}`);
  return q;
}

/**
 * Returns a mutation for updating a venue rating. Designed for venue owners.
 * @param profileName - Optional profile name used to invalidate owner-specific caches.
 */
export function useRateVenue(profileName?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ venueId, rating }: { venueId: string; rating: number }) =>
      updateVenue(venueId, { rating }),
    onSuccess: (_, { venueId }) => {
      if (profileName) {
        qc.invalidateQueries({ queryKey: qk.bookingsByProfile(profileName) });
      }
      qc.invalidateQueries({ queryKey: qk.venue(venueId) });
      qc.invalidateQueries({ queryKey: qk.venues() });
    },
  });
}
