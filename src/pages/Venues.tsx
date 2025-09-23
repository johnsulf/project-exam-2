import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/money";
import { VenueListSkeleton } from "@/components/skeletons/VenueListSkeleton";
import { useVenues } from "@/features/venues/hooks";
import { VenuesSearchBar } from "@/features/venues/components/VenuesSearchBar";
import { PaginationBar } from "@/features/venues/components/PaginationBar";
import type { TPageMeta } from "@/types/schemas";
import { isVenueAvailable } from "@/features/venues/utils/availability";
import { ActiveFilters } from "@/features/venues/components/ActiveFilters";

function bool(v: string | null) {
  return v === "1" || v?.toLowerCase() === "true";
}

export default function Venues() {
  const [params] = useSearchParams();

  const rawLimit = Number(params.get("limit") ?? 20);
  const limit = Math.min(100, Math.max(1, rawLimit));
  const page = Math.max(1, Number(params.get("page") ?? 1));

  const q = params.get("q")?.trim() || "";
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
    guests > 0 ||
    wantsDates ||
    wantWifi ||
    wantParking ||
    wantPets ||
    wantBreakfast
  );

  const hasClientFilters =
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
    q: q || undefined,
  };

  if (wantsDates) serverParams._bookings = true;

  const { data, isLoading, isError, refetch, isFetching } =
    useVenues(serverParams);

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

  return (
    <>
      <VenuesSearchBar />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pageItems.map((v) => {
            const firstMedia = v.media?.[0];
            const imageUrl = firstMedia?.url;
            const imageAlt = firstMedia?.alt ?? `Image of ${v.name}`;
            const numericRating =
              typeof v.rating === "number" && !Number.isNaN(v.rating)
                ? v.rating
                : null;
            const hasRating = numericRating !== null && numericRating > 0;
            const highlightStar = numericRating !== null && numericRating >= 1;
            return (
              <div
                key={v.id}
                className="rounded-md shadow border p-2 grid gap-2"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : (
                  <div
                    role="img"
                    aria-label={`No image available for ${v.name}`}
                    className="w-full h-48 flex items-center justify-center rounded-md bg-muted text-muted-foreground"
                  >
                    <span>No image available</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  {v.location?.city && v.location?.country && (
                    <div className="text-sm font-semibold">
                      {v.location.city}, {v.location.country}
                    </div>
                  )}
                  <div className="flex gap-1 items-center text-sm font-semibold ml-auto">
                    <Star
                      className={
                        highlightStar
                          ? "text-yellow-500"
                          : "text-muted-foreground"
                      }
                    />
                    <p>
                      {hasRating ? numericRating!.toPrecision(2) : "No ratings"}
                    </p>
                  </div>
                </div>

                <h3>{v.name}</h3>

                <div className="flex gap-1 flex-wrap">
                  <Badge variant="secondary">Guests: {v.maxGuests}</Badge>
                  {v.meta?.parking && (
                    <Badge variant="secondary">Parking</Badge>
                  )}
                  {v.meta?.wifi && <Badge variant="secondary">WiFi</Badge>}
                  {v.meta?.pets && <Badge variant="secondary">Pets</Badge>}
                  {v.meta?.breakfast && (
                    <Badge variant="secondary">Breakfast</Badge>
                  )}
                </div>

                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">
                    {formatMoney(v.price, { currency: "USD" })} / night
                  </p>
                  <Link to={`/venues/${v.id}`}>
                    <Button>
                      View Details
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PaginationBar meta={meta} />
      {isFetching && <div className="mt-3 text-sm opacity-70">Refreshing…</div>}
    </>
  );
}
