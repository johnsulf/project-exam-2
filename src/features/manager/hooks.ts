import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createVenue, getVenuesByProfile } from "@/lib/endpoints";
import { qk } from "@/lib/queryKeys";
import { toast } from "sonner";
import type { TVenueCreate } from "@/types/schemas";

export function useMyVenues(
  name?: string,
  params: Record<string, unknown> = {},
) {
  return useQuery({
    enabled: !!name,
    queryKey: name ? qk.profileVenues(name, params) : qk.profileVenues(""),
    queryFn: ({ signal }) => getVenuesByProfile(name!, params, signal),
    placeholderData: (prev) => prev,
    staleTime: 60_000,
    retry: 1,
  });
}

export function useCreateVenue() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TVenueCreate) => createVenue(input),
    onSuccess: () => {
      toast.success("Venue created");
      // refresh lists
      qc.invalidateQueries({ queryKey: qk.venues() });
      qc.invalidateQueries({ queryKey: ["profileVenues"] });
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Create venue failed";
      toast.error(msg);
    },
  });
}
