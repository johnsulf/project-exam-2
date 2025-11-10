import { useAuth } from "@/features/auth/store";
import {
  useProfile,
  useProfileBookings,
  useRateVenue,
} from "@/features/profile/hooks";
import { ProfileHeaderSkeleton } from "@/components/skeletons/ProfileHeaderSkeleton";
import { AvatarBlock } from "@/features/profile/AvatarBlock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AvatarDialog } from "@/features/profile/AvatarDialog";
import { BookingCard } from "@/features/profile/BookingCard";
import { EmptyBookings } from "@/features/profile/EmptyBookings";
import { BookingListSkeleton } from "@/components/skeletons/BookingListSkeleton";
import { useRouteHeadingFocus } from "@/components/a11y/useRouteHeadingFocus";
import { ManagerToggle } from "@/features/profile/ManagerToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { getErrorMessage } from "@/helpers/errorMessageHelper";
import { Spinner } from "@/components/ui/spinner";
import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";
import { routes } from "@/router/routes";

const LOCAL_RATINGS_KEY = "holidaze:mockRatings";
type LocalRatingStore = Record<string, Record<string, number>>;

export default function Profile() {
  const { profile: authProfile } = useAuth();
  const name = authProfile?.name;

  const { data: p, isLoading, isError, refetch, isFetching } = useProfile(name);
  const {
    data: bookingsEnv,
    isLoading: bLoading,
    isError: bError,
    refetch: refetchBookings,
  } = useProfileBookings(name);

  const upcomingBookings = bookingsEnv?.data.upcoming ?? [];
  const pastBookings = bookingsEnv?.data.past ?? [];
  const [openAvatar, setOpenAvatar] = useState(false);
  const [bookingTab, setBookingTab] = useState<"upcoming" | "past">("upcoming");
  const [ratedBookings, setRatedBookings] = useState<Record<string, number>>(
    {},
  );
  const [mockRatings, setMockRatings] = useState<Record<string, number>>({});
  const [pendingRatingId, setPendingRatingId] = useState<string | null>(null);
  const rateVenue = useRateVenue(name);

  useEffect(() => {
    if (upcomingBookings.length === 0 && pastBookings.length > 0) {
      setBookingTab("past");
    }
  }, [upcomingBookings.length, pastBookings.length]);

  useEffect(() => {
    if (!name) return;
    setMockRatings(readStoredMockRatings(name));
  }, [name]);

  const h1Ref = useRouteHeadingFocus<HTMLHeadingElement>();
  const breadcrumbs = [
    { label: "Home", to: routes.home },
    { label: "Profile" },
  ];

  function handleRate(
    bookingId: string,
    venueId: string | undefined,
    value: number,
    isOwner: boolean,
  ) {
    if (!value || !venueId) return;
    if (!isOwner) {
      setMockRatings((prev) => {
        const next = { ...prev, [bookingId]: value };
        if (name) {
          persistMockRating(name, next);
        }
        return next;
      });
      toast.success("Thanks for your rating!");
      return;
    }
    setPendingRatingId(bookingId);
    rateVenue.mutate(
      { venueId, rating: value },
      {
        onSuccess: () => {
          setRatedBookings((prev) => {
            const next = { ...prev, [bookingId]: value };
            return next;
          });
          toast.success("Thanks for rating your stay!");
        },
        onError: (err) => {
          toast.error(getErrorMessage(err));
        },
        onSettled: () => {
          setPendingRatingId((prev) => (prev === bookingId ? null : prev));
        },
      },
    );
  }

  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        <ProfileHeaderSkeleton />
      </div>
    );
  }

  if (isError || !p) {
    return (
      <div className="space-y-3" role="alert">
        <p className="text-destructive">Couldn’t load your profile.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" aria-labelledby="profile-title">
      <PageBreadcrumbs items={breadcrumbs} />
      <div className="space-y-8">
        {/* Banner (decorative) */}
        <div
          className="rounded-xl border bg-muted h-24 w-full"
          aria-hidden="true"
        />

        {/* Header section */}
        <section
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          aria-labelledby="profile-title"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <AvatarBlock
              url={p.avatar?.url}
              alt={p.avatar?.alt}
              name={p.name}
              size={80}
            />

            <div className="space-y-2">
              <h1
                id="profile-title"
                ref={h1Ref}
                tabIndex={-1}
                className="text-3xl font-semibold focus:outline-none focus:ring-2 focus:ring-ring rounded"
              >
                {p.name}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {p.email}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {p.venueManager ? "Venue manager" : "Customer"}
                </Badge>
                {isFetching && (
                  <span
                    className="text-xs text-muted-foreground"
                    aria-live="polite"
                  >
                    Refreshing…
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setOpenAvatar(true)}
              aria-haspopup="dialog"
              className="w-full sm:w-auto"
            >
              Edit avatar
            </Button>
          </div>

          <AvatarDialog
            open={openAvatar}
            onOpenChange={setOpenAvatar}
            name={p.name}
            currentUrl={p.avatar?.url}
            currentAlt={p.avatar?.alt}
          />
        </section>

        {/* Stats */}
        <section
          className="flex flex-wrap items-stretch gap-3"
          aria-label="Account statistics"
        >
          <ManagerToggle name={p.name} venueManager={!!p.venueManager} />
        </section>

        {/* Upcoming bookings */}
        <section className="space-y-4" aria-labelledby="bookings-heading">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="bookings-heading" className="text-xl font-semibold">
              Your bookings
            </h2>
          </div>

          {bLoading ? (
            <div role="status" aria-live="polite">
              <BookingListSkeleton count={3} />
            </div>
          ) : bError ? (
            <div className="space-y-2" role="alert">
              <p className="text-destructive">Couldn’t load bookings.</p>
              <Button onClick={() => refetchBookings()}>Retry</Button>
            </div>
          ) : (
            <Tabs
              value={bookingTab}
              onValueChange={(value) =>
                setBookingTab((value as "upcoming" | "past") ?? "upcoming")
              }
              aria-label="Bookings categories"
              className="space-y-3"
            >
              <TabsList>
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Earlier ({pastBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" role="region" aria-live="polite">
                {upcomingBookings.length === 0 ? (
                  <EmptyBookings />
                ) : (
                  <ul className="grid gap-3">
                    {upcomingBookings.map((b) => (
                      <li key={b.id}>
                        <BookingCard
                          id={b.id}
                          dateFrom={b.dateFrom}
                          dateTo={b.dateTo}
                          guests={b.guests}
                          venue={b.venue}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>

              <TabsContent value="past" role="region" aria-live="polite">
                {pastBookings.length === 0 ? (
                  <EmptyBookings message="No earlier bookings yet." />
                ) : (
                  <ul className="grid gap-3">
                    {pastBookings.map((b) => {
                      const venueId = b.venue?.id;
                      const isOwner = venueId
                        ? b.venue?.owner?.name === p.name
                        : false;
                      const serverRating =
                        typeof b.venue?.rating === "number"
                          ? b.venue.rating
                          : 0;
                      const localRating = mockRatings[b.id];
                      const sessionRating = ratedBookings[b.id];
                      const currentRating =
                        sessionRating ?? localRating ?? serverRating;
                      const displayValue = Math.round(currentRating ?? 0);

                      let message: string;
                      if (!venueId) {
                        message = "Venue no longer available for rating.";
                      } else if (!isOwner) {
                        message = localRating
                          ? `You rated this stay ${localRating}/5.`
                          : "How would you rate your stay?";
                      } else if (currentRating) {
                        message = `Current rating: ${currentRating}/5`;
                      } else {
                        message = "Tell guests how this stay went.";
                      }

                      const disabled =
                        !venueId ||
                        (isOwner &&
                          (pendingRatingId === b.id || rateVenue.isPending));

                      return (
                        <li key={b.id}>
                          <BookingCard
                            id={b.id}
                            dateFrom={b.dateFrom}
                            dateTo={b.dateTo}
                            guests={b.guests}
                            venue={b.venue}
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div className="text-sm text-muted-foreground">
                                {message}
                              </div>
                              <div className="flex items-center gap-2">
                                <RatingStars
                                  value={displayValue}
                                  onSelect={(value) =>
                                    handleRate(b.id, venueId, value, isOwner)
                                  }
                                  disabled={disabled}
                                />
                                {pendingRatingId === b.id && (
                                  <Spinner
                                    className="size-4"
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                            </div>
                          </BookingCard>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </TabsContent>
            </Tabs>
          )}
        </section>
      </div>
    </div>
  );
}

type RatingStarsProps = {
  value: number;
  onSelect: (value: number) => void;
  disabled?: boolean;
};

function RatingStars({ value, onSelect, disabled }: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label="Rate this venue"
    >
      {stars.map((star) => {
        const selected = value >= star;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={selected}
            className="rounded-full p-1 text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            onClick={() => onSelect(star)}
            disabled={disabled}
          >
            <Star
              className={selected ? "size-5 text-yellow-500" : "size-5"}
              fill={selected ? "currentColor" : "none"}
              strokeWidth={selected ? 1.5 : 1.8}
            />
            <span className="sr-only">{`Rate ${star} star${star === 1 ? "" : "s"}`}</span>
          </button>
        );
      })}
    </div>
  );
}

function readStoredMockRatings(userName: string): Record<string, number> {
  if (typeof window === "undefined" || !userName) return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_RATINGS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as LocalRatingStore;
    return parsed?.[userName] ?? {};
  } catch {
    return {};
  }
}

function persistMockRating(
  userName: string,
  ratings: Record<string, number>,
): void {
  if (typeof window === "undefined" || !userName) return;
  try {
    const raw = window.localStorage.getItem(LOCAL_RATINGS_KEY);
    const parsed: LocalRatingStore = raw ? JSON.parse(raw) : {};
    parsed[userName] = ratings;
    window.localStorage.setItem(LOCAL_RATINGS_KEY, JSON.stringify(parsed));
  } catch {
    // ignore write errors
  }
}
