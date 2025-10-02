import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaginationBar } from "@/features/venues/components/PaginationBar";
import { useAuth } from "@/features/auth/store";
import { useMyVenues } from "@/features/manager/hooks";
import { ManageVenuesSkeleton } from "@/features/manager/ManageVenuesSkeleton";
import { ArrowRight, Edit } from "lucide-react";
import { formatMoney } from "@/lib/money";
import type { TPageMeta } from "@/types/schemas";

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
  const meta = (data.meta ?? {
    isFirstPage: true,
    isLastPage: true,
    currentPage: 1,
    previousPage: null,
    nextPage: null,
    pageCount: 1,
    totalCount: venues.length,
  }) as TPageMeta;

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage venues</h1>
        <Button asChild>
          <Link to="/manage/new">
            Create venue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </header>

      {venues.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="rounded-xl border overflow-hidden">
            <div className="grid grid-cols-[1fr_120px_90px_120px_140px] gap-0 px-3 py-2 border-b text-sm text-muted-foreground bg-muted/30">
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
                  className="grid grid-cols-[1fr_120px_90px_120px_140px] items-center gap-0 px-3 py-3"
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
                      <Link to={`/venues/${v.id}`}>View</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link to={`/manage/${v.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      asChild
                    >
                      <Link to={`/manage/${v.id}/delete`}>Delete</Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <PaginationBar meta={meta} />

          {isFetching && (
            <div className="mt-2 text-sm text-muted-foreground">
              Refreshing…
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border p-6 text-center">
      <h2 className="text-lg font-semibold">You have no venues yet</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Create your first venue to start taking bookings.
      </p>
      <Button className="mt-4" asChild>
        <Link to="/manage/new">Create venue</Link>
      </Button>
    </div>
  );
}
