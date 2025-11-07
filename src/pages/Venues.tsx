import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { VenueListSkeleton } from "@/components/skeletons/VenueListSkeleton";
import { useVenues } from "@/features/venues/hooks";
import { VenuesSearchBar } from "@/features/venues/components/VenuesSearchBar";
import { PaginationBar } from "@/features/venues/components/PaginationBar";
import type { TPageMeta } from "@/types/schemas";
import { isVenueAvailable } from "@/features/venues/utils/availability";
import { ActiveFilters } from "@/features/venues/components/ActiveFilters";
import { VenueCard } from "@/features/venues/components/VenueCard";
import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";
import { routes } from "@/router/routes";

function bool(v: string | null) {
  return v === "1" || v?.toLowerCase() === "true";
}

export default function Venues() {
  const [params] = useSearchParams();

  const rawLimit = Number(params.get("limit") ?? 20);
  const limit = Math.min(100, Math.max(1, rawLimit));
  const page = Math.max(1, Number(params.get("page") ?? 1));

  const q = params.get("q")?.trim() || "";
  const searchTerm = q.toLowerCase();
  const useClientSearch = searchTerm.length > 0;
  const cityParam = params.get("city")?.trim() ?? "";
  const city = cityParam.toLowerCase();
  const guests = Number(params.get("guests") ?? 0);
  const from = params.get("from") ? new Date(params.get("from")!) : undefined;
  const to = params.get("to") ? new Date(params.get("to")!) : undefined;

  const wantWifi = bool(params.get("wifi"));
  const wantParking = bool(params.get("parking"));
  const wantPets = bool(params.get("pets"));
  const wantBreakfast = bool(params.get("breakfast"));

  const wantsDates = !!(from && to);

  const hasFiltersApplied = !!(
    q ||
    cityParam ||
    guests > 0 ||
    wantsDates ||
    wantWifi ||
    wantParking ||
    wantPets ||
    wantBreakfast
  );

  const hasClientFilters =
    useClientSearch ||
    !!city ||
    guests > 0 ||
    wantWifi ||
    wantParking ||
    wantPets ||
    wantBreakfast ||
    wantsDates;

  const fetchLimit = hasClientFilters ? 100 : limit;
  const serverParams: Record<string, unknown> = {
    page: hasClientFilters ? 1 : page,
    limit: fetchLimit,
  };

  if (!useClientSearch && q) serverParams.q = q;

  if (wantsDates) serverParams._bookings = true;

  const { data, isLoading, isError, refetch, isFetching } = useVenues(
    serverParams,
    { fetchAllPages: hasClientFilters },
  );

  if (isLoading) return <VenueListSkeleton count={limit} />;

  if (isError || !data) {
    return (
      <div className="space-y-3">
        <p className="text-destructive">Couldn’t load venues.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const fetched = data?.data ?? [];
  let filtered = fetched;

  if (hasClientFilters) {
    filtered = fetched.filter((v) => {
      if (searchTerm) {
        const location = v.location ?? {};
        const haystacks = [
          v.name,
          v.description,
          location.address ?? "",
          location.city ?? "",
          location.country ?? "",
          location.continent ?? "",
        ].map((value) =>
          typeof value === "string" ? value.toLowerCase() : "",
        );

        const matchesSearch = haystacks.some((value) =>
          value.includes(searchTerm),
        );

        if (!matchesSearch) return false;
      }
      if (city) {
        const c = (v.location?.city ?? "").toLowerCase();
        if (!c.includes(city)) return false;
      }
      if (guests && v.maxGuests < guests) return false;
      if (wantWifi && !v.meta?.wifi) return false;
      if (wantParking && !v.meta?.parking) return false;
      if (wantPets && !v.meta?.pets) return false;
      if (wantBreakfast && !v.meta?.breakfast) return false;
      if (wantsDates && !isVenueAvailable(v, from!, to!)) return false;
      return true;
    });
  }

  let meta: TPageMeta;
  if (hasClientFilters) {
    const total = filtered.length;
    const pageCount = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, pageCount);
    const previousPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < pageCount ? currentPage + 1 : null;

    meta = {
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === pageCount,
      currentPage,
      previousPage,
      nextPage,
      pageCount,
      totalCount: total,
    };
  } else {
    meta = (data.meta as TPageMeta) ?? {
      isFirstPage: true,
      isLastPage: true,
      currentPage: 1,
      previousPage: null,
      nextPage: null,
      pageCount: 1,
      totalCount: data.data?.length ?? 0,
    };
  }

  const startIdx = (meta.currentPage - 1) * limit;
  const endIdx = startIdx + limit;
  const pageItems = hasClientFilters
    ? filtered.slice(startIdx, endIdx)
    : fetched;

  const showingStart = meta.totalCount ? startIdx + 1 : 0;
  const showingEnd = Math.min(meta.totalCount, endIdx);
  const breadcrumbs = [{ label: "Home", to: routes.home }, { label: "Venues" }];

  return (
    <>
      <PageBreadcrumbs items={breadcrumbs} className="mb-4" />
      <VenuesSearchBar loading={isFetching} />
      <ActiveFilters />

      {/* Result header */}
      <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
        <div>
          <span className="font-medium text-foreground">{meta.totalCount}</span>
          {hasFiltersApplied ? <> filtered results</> : <> results</>}
          {meta.totalCount > 0 && (
            <span className="ml-2">
              Showing {showingStart}-{showingEnd}
            </span>
          )}
        </div>
      </div>

      {/* Cards */}
      {pageItems.length === 0 ? (
        <p className="mt-4">No venues match your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {pageItems.map((v) => {
            return <VenueCard key={v.id} v={v} />;
          })}
        </div>
      )}

      <PaginationBar meta={meta} />
      {isFetching && <div className="mt-3 text-sm opacity-70">Refreshing…</div>}
    </>
  );
}
