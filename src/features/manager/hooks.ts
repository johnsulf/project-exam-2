import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getVenuesByProfile } from "@/lib/endpoints";
import { qk } from "@/lib/queryKeys";
import { toast } from "sonner";

export function useMyVenues(
  name?: string,
  params: Record<string, unknown> = {},
) {
  const query = useQuery({
    enabled: !!name,
    queryKey: name ? qk.profileVenues(name, params) : qk.profileVenues(""),
    queryFn: ({ signal }) => getVenuesByProfile(name!, params, signal),
    placeholderData: (prev) => prev,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (query.error) {
      const e = query.error;
      const msg = e instanceof Error ? e.message : "Failed to load venues";
      toast.error(msg);
    }
  }, [query.error]);

  return query;
}
