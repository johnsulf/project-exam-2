import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import {
  getBookingsByProfile,
  getProfile,
  updateProfile,
} from "@/lib/endpoints";
import { useAuth } from "../auth/store";
import { getErrorMessage } from "@/lib/errors";
import { useQueryErrorToast } from "@/lib/queryToasts";
import type { Profile } from "@/types/api";

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

export function useUpcomingBookings(name?: string) {
  const q = useQuery({
    enabled: !!name,
    queryKey: name ? qk.bookingsByProfile(name) : ["bookings", "profile"],
    queryFn: ({ signal }) =>
      getBookingsByProfile(name!, { _venue: true }, signal),
    select: (env) => {
      const now = Date.now();
      const upcoming = (env.data ?? []).filter(
        (b) => new Date(b.dateTo).getTime() >= now,
      );
      upcoming.sort(
        (a, b) =>
          new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime(),
      );
      return { data: upcoming, meta: env.meta };
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
  useQueryErrorToast(q, (e) => `Couldn't load bookings: ${getErrorMessage(e)}`);
  return q;
}
