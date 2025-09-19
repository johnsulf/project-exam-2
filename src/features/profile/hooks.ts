import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { getProfile } from "@/lib/endpoints";

export function useProfile(name?: string) {
  return useQuery({
    enabled: !!name,
    queryKey: name ? qk.profile(name) : ["profile"],
    queryFn: ({ signal }) =>
      getProfile(name!, { _bookings: false, _venues: false }, signal),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
