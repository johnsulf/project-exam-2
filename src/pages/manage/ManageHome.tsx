import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaginationBar } from "@/features/venues/components/PaginationBar";
import { useAuth } from "@/features/auth/store";
import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";
import { useMyVenues } from "@/features/manager/hooks";
import { ManageVenuesSkeleton } from "@/components/skeletons/ManageVenuesSkeleton";
import { Plus } from "lucide-react";
import { CircleQuestionMark } from "lucide-react";
import { formatMoney } from "@/lib/money";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

  const breadcrumbs = [{ label: "Home", to: "/" }, { label: "Manage" }];

  if (isLoading)
    return (
      <div className="space-y-4">
        <PageBreadcrumbs items={breadcrumbs} />
        <ManageVenuesSkeleton rows={6} />
      </div>
    );

  if (!name || isError || !data) {
    return (
      <div className="space-y-4">
        <PageBreadcrumbs items={breadcrumbs} />
        <h1>Manage venues</h1>
        <p className="text-destructive">
          {name ? "Couldn’t load your venues." : "You must be signed in."}
        </p>
        {name && <Button onClick={() => refetch()}>Retry</Button>}
      </div>
    );
  }

  const venues = data.data ?? [];

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
      <PageBreadcrumbs items={breadcrumbs} />
      <header className="flex items-center justify-between">
        <h1>Manage venues</h1>
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
          <div className="hidden md:block rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Price / night</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venues.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="min-w-0 space-y-1">
                      <div className="truncate font-medium">{v.name}</div>
                      <div className="text-muted-foreground truncate">
                        {v.description}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {v.meta?.wifi && (
                          <Badge variant="secondary">WiFi</Badge>
                        )}
                        {v.meta?.parking && (
                          <Badge variant="secondary">Parking</Badge>
                        )}
                        {v.meta?.pets && (
                          <Badge variant="secondary">Pets</Badge>
                        )}
                        {v.meta?.breakfast && (
                          <Badge variant="secondary">Breakfast</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{v.location?.city ?? "-"}</TableCell>
                    <TableCell>
                      {typeof v.rating === "number" && v.rating > 0
                        ? v.rating.toPrecision(2)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {formatMoney(v.price, { currency: "USD" })}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/manage/${v.id}`}>Manage</Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/manage/${v.id}/bookings`}>Bookings</Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-4 md:hidden">
            {venues.map((v) => (
              <article
                key={v.id}
                className="rounded-lg border p-4 space-y-4 bg-card"
              >
                <div className="space-y-2">
                  <h2>{v.name}</h2>
                  <p className="text-muted-foreground">{v.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {v.meta?.wifi && <Badge variant="secondary">WiFi</Badge>}
                  {v.meta?.parking && (
                    <Badge variant="secondary">Parking</Badge>
                  )}
                  {v.meta?.pets && <Badge variant="secondary">Pets</Badge>}
                  {v.meta?.breakfast && (
                    <Badge variant="secondary">Breakfast</Badge>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">City</span>
                    <span>{v.location?.city ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span>
                      {typeof v.rating === "number" && v.rating > 0
                        ? v.rating.toPrecision(2)
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price / night</span>
                    <span>{formatMoney(v.price, { currency: "USD" })}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full sm:flex-1"
                  >
                    <Link to={`/manage/${v.id}`}>Manage</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full sm:flex-1"
                  >
                    <Link to={`/manage/${v.id}/bookings`}>Bookings</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-4">
            <PaginationBar meta={paginationMeta} />
            {isFetching && (
              <div className="text-muted-foreground">Refreshing…</div>
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
