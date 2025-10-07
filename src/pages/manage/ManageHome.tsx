import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaginationBar } from "@/features/venues/components/PaginationBar";
import { useAuth } from "@/features/auth/store";
import { useMyVenues } from "@/features/manager/hooks";
import { ManageVenuesSkeleton } from "@/features/manager/ManageVenuesSkeleton";
import { Plus } from "lucide-react";
import { CircleQuestionMark } from "lucide-react";
import { formatMoney } from "@/lib/money";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function ManageHome() {
  const { profile } = useAuth();
  const name = profile?.name;

  const [params] = useSearchParams();
  const page = Math.max(1, Number(params.get("page") ?? 1));
  const limit = Math.min(100, Math.max(1, Number(params.get("limit") ?? 10)));

  const { data, isLoading, isError, refetch, isFetching } = useMyVenues(name, {
    page,
    limit,
  });

  if (isLoading) return <ManageVenuesSkeleton rows={limit} />;

  // if query is disabled (no name) or errored
  if (!name || isError || !data) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Manage venues</h1>
        <p className="text-destructive">
          {name ? "Couldn’t load your venues." : "You must be signed in."}
        </p>
        {name && <Button onClick={() => refetch()}>Retry</Button>}
      </div>
    );
  }

  const venues = data.data ?? [];

  // Explicit meta types to avoid use of 'any'
  type PageMeta = {
    isFirstPage: boolean;
    isLastPage: boolean;
    currentPage: number;
    previousPage: number | null;
    nextPage: number | null;
    pageCount: number;
    totalCount: number;
  };

  type ApiMeta = {
    page?: number;
    pageCount?: number;
    total?: number;
  };

  const rawMeta = data.meta as PageMeta | ApiMeta | undefined;

  const paginationMeta: PageMeta =
    rawMeta && "isFirstPage" in rawMeta
      ? (rawMeta as PageMeta)
      : {
          isFirstPage: (rawMeta?.page ?? 1) <= 1,
          isLastPage: (rawMeta?.page ?? 1) >= (rawMeta?.pageCount ?? 1),
          currentPage: rawMeta?.page ?? 1,
          previousPage:
            (rawMeta?.page ?? 1) > 1 ? (rawMeta?.page ?? 1) - 1 : null,
          nextPage:
            (rawMeta?.page ?? 1) < (rawMeta?.pageCount ?? 1)
              ? (rawMeta?.page ?? 1) + 1
              : null,
          pageCount: rawMeta?.pageCount ?? 1,
          totalCount:
            rawMeta && "total" in rawMeta && typeof rawMeta.total === "number"
              ? rawMeta.total
              : venues.length,
        };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage venues</h1>
        <Button asChild>
          <Link to="/manage/new">
            Create venue
            <Plus />
          </Link>
        </Button>
      </header>

      {venues.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="rounded-xl border overflow-hidden">
            <div className="grid grid-cols-5 gap-0 px-3 py-2 border-b text-sm text-muted-foreground bg-muted/30">
              <div>Venue</div>
              <div>City</div>
              <div>Rating</div>
              <div>Price / night</div>
              <div className="text-right">Actions</div>
            </div>

            <ul className="divide-y">
              {venues.map((v) => (
                <li
                  key={v.id}
                  className="grid grid-cols-5 items-center gap-0 px-3 py-3"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">{v.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {v.description}
                    </div>
                    <div className="mt-1 flex gap-1 flex-wrap">
                      {v.meta?.wifi && <Badge variant="secondary">WiFi</Badge>}
                      {v.meta?.parking && (
                        <Badge variant="secondary">Parking</Badge>
                      )}
                      {v.meta?.pets && <Badge variant="secondary">Pets</Badge>}
                      {v.meta?.breakfast && (
                        <Badge variant="secondary">Breakfast</Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-sm">{v.location?.city ?? "-"}</div>

                  <div className="text-sm">
                    {typeof v.rating === "number" && v.rating > 0
                      ? v.rating.toPrecision(2)
                      : "—"}
                  </div>

                  <div className="text-sm">
                    {formatMoney(v.price, { currency: "USD" })}
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/manage/${v.id}`}>Manage</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link to={`/manage/${v.id}/bookings`}>Bookings</Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <PaginationBar meta={paginationMeta} />
            {isFetching && (
              <div className="mt-2 text-sm text-muted-foreground">
                Refreshing…
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleQuestionMark />
        </EmptyMedia>
        <EmptyTitle>No Venues Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any venues yet. Get started by creating your
          first venue.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link to="/manage/new">
            Create Venue <Plus />
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
