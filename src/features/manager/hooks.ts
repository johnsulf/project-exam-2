import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createVenue,
  getVenuesByProfile,
  updateVenue,
  deleteVenue,
} from "@/lib/endpoints";
import { qk } from "@/lib/queryKeys";
import { toast } from "sonner";
import type { TVenueCreate, TVenueUpdate } from "@/types/schemas";
import { getErrorMessage } from "@/lib/errors";

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
      toast.error(`Couldn't create venue: ${getErrorMessage(e)}`);
    },
  });
}

export function useUpdateVenue(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: TVenueUpdate) => updateVenue(id, patch),
    onSuccess: () => {
      toast.success("Venue updated");
      qc.invalidateQueries({ queryKey: qk.venue(id) });
      qc.invalidateQueries({ queryKey: qk.venues() });
      qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) && q.queryKey[0] === "profileVenues",
      });
    },
    onError: (e: unknown) => {
      toast.error(`Couldn't update venue: ${getErrorMessage(e)}`);
    },
  });
}

export function useDeleteVenue(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteVenue(id),
    onSuccess: () => {
      toast.success("Venue deleted");
      qc.invalidateQueries({ queryKey: qk.venues() });
      qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) && q.queryKey[0] === "profileVenues",
      });
    },
    onError: (e: unknown) => {
      toast.error(`Couldn't delete venue: ${getErrorMessage(e)}`);
    },
  });
}
