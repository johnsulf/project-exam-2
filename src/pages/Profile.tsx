import { useAuth } from "@/features/auth/store";
import { useProfile, useProfileBookings } from "@/features/profile/hooks";
import { ProfileHeaderSkeleton } from "@/features/profile/ProfileHeaderSkeleton";
import { AvatarBlock } from "@/features/profile/AvatarBlock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AvatarDialog } from "@/features/profile/AvatarDialog";
import { BookingCard } from "@/features/profile/BookingCard";
import { EmptyBookings } from "@/features/profile/EmptyBookings";
import { BookingListSkeleton } from "@/features/profile/BookingListSkeleton";
import { useRouteHeadingFocus } from "@/components/a11y/useRouteHeadingFocus";
import { ManagerToggle } from "@/features/profile/ManagerToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  useEffect(() => {
    if (upcomingBookings.length === 0 && pastBookings.length > 0) {
      setBookingTab("past");
    }
  }, [upcomingBookings.length, pastBookings.length]);

  const h1Ref = useRouteHeadingFocus<HTMLHeadingElement>();

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
    <div className="space-y-8" aria-labelledby="profile-title">
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
              <Badge variant={p.venueManager ? "default" : "secondary"}>
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
                  {pastBookings.map((b) => (
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
          </Tabs>
        )}
      </section>
    </div>
  );
}
