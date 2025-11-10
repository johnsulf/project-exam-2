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
import { getErrorMessage } from "@/helpers/errorMessageHelper";
import { Spinner } from "@/components/ui/spinner";
import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";
import { routes } from "@/router/routes";
import { RatingStars } from "@/features/profile/components/RatingStars";
import {
  persistMockRating,
  readStoredMockRatings,
} from "@/features/profile/components/mockRatings";

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
      <div className="space-y-4" role="alert">
        <p className="text-destructive">Couldn’t load your profile.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6" aria-labelledby="profile-title">
      <PageBreadcrumbs items={breadcrumbs} />
      <div className="space-y-8">
        {/* Banner */}
        {p.banner?.url ? (
          <img
            src={p.banner.url}
            alt={p.banner.alt || `${p.name}'s profile banner`}
            className="h-24 w-full rounded-lg object-cover border"
          />
        ) : (
          <div
            className="rounded-lg border bg-muted h-24 w-full"
            aria-hidden="true"
          />
        )}

        {/* Header section */}
        <section
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          aria-labelledby="profile-title"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
                className="text-4xl font-semibold focus:outline-none focus:ring-2 focus:ring-ring rounded"
              >
                {p.name}
              </h1>
              <p className="text-muted-foreground">{p.email}</p>

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

          <Button
            variant="outline"
            onClick={() => setOpenAvatar(true)}
            aria-haspopup="dialog"
            className="w-full sm:w-auto"
          >
            Edit avatar
          </Button>

          <AvatarDialog
            open={openAvatar}
            onOpenChange={setOpenAvatar}
            name={p.name}
            currentUrl={p.avatar?.url}
            currentAlt={p.avatar?.alt}
          />
        </section>

        {/* Manager toggle */}
        <ManagerToggle name={p.name} venueManager={!!p.venueManager} />

        {/* Bookings */}
        <section className="space-y-4" aria-labelledby="bookings-heading">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="bookings-heading" className="text-3xl font-semibold">
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
              className="space-y-4"
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
                  <ul className="grid gap-4">
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
                  <ul className="grid gap-4">
                    {pastBookings.map((b) => {
                      const venueId = b.venue?.id;
                      const isOwner = venueId
                        ? b.venue?.owner?.name === p.name
                        : false;
                      const serverRating =
                        typeof b.venue?.rating === "number"
                          ? b.venue.rating
                          : 0;
                      // Ratings come from (1) this session's API mutation, (2) locally stored guest ratings,
                      // then finally fall back to the server's current rating.
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
                          // Owners write ratings to the API, so lock the control while the mutation runs.
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
                              <div className="text-muted-foreground">
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
                                  <Spinner aria-hidden="true" />
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
