import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { getProfile, updateProfile } from "@/lib/endpoints";
import { useAuth } from "../auth/store";

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

export function useUpdateProfile(name: string) {
  const qc = useQueryClient();
  const { setProfile } = useAuth(); // ensure your store exposes this

  return useMutation({
    mutationFn: (patch: { avatar: { url: string; alt?: string } }) =>
      updateProfile(name, patch),
    onSuccess: (next) => {
      qc.invalidateQueries({ queryKey: qk.profile(name) });
      setProfile(next); // instantly update header/Profile UI
    },
  });
}
