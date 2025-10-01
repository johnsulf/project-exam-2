import { useAuth } from "@/features/auth/store";
import { useProfile, useUpcomingBookings } from "@/features/profile/hooks";
import { ProfileHeaderSkeleton } from "@/features/profile/ProfileHeaderSkeleton";
import { AvatarBlock } from "@/features/profile/AvatarBlock";
import { StatChip } from "@/features/profile/StatChip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AvatarDialog } from "@/features/profile/AvatarDialog";
import { BookingCard } from "@/features/profile/BookingCard";
import { EmptyBookings } from "@/features/profile/EmptyBookings";
import { BookingListSkeleton } from "@/features/profile/BookingListSkeleton";
import { useRouteHeadingFocus } from "@/components/a11y/useRouteHeadingFocus";
import { ManagerToggle } from "@/features/profile/ManagerToggle";

export default function Profile() {
  const { profile: authProfile } = useAuth();
  const name = authProfile?.name;

  const { data: p, isLoading, isError, refetch, isFetching } = useProfile(name);
  const {
    data: bookingsEnv,
    isLoading: bLoading,
    isError: bError,
    refetch: refetchBookings,
  } = useUpcomingBookings(name);

  const bookings = bookingsEnv?.data ?? [];
  const [openAvatar, setOpenAvatar] = useState(false);

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

  const countVenues = p._count?.venues ?? p.venues?.length;
  const countBookings = p._count?.bookings ?? p.bookings?.length;

  return (
    <div className="space-y-8" aria-labelledby="profile-title">
      {/* Banner (decorative) */}
      <div
        className="rounded-xl border bg-muted h-24 w-full"
        aria-hidden="true"
      />

      {/* Header section */}
      <section
        className="flex items-center gap-4"
        aria-labelledby="profile-title"
      >
        <AvatarBlock
          url={p.avatar?.url}
          alt={p.avatar?.alt}
          name={p.name}
          size={72}
        />

        <div>
          <h1
            id="profile-title"
            ref={h1Ref}
            tabIndex={-1}
            className="text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            {p.name}
          </h1>
          <p className="text-muted-foreground text-sm">{p.email}</p>

          <div className="mt-2 flex items-center gap-2">
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

        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            onClick={() => setOpenAvatar(true)}
            aria-haspopup="dialog"
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
      <section className="flex gap-2" aria-label="Account statistics">
        <StatChip label="Venues" value={countVenues} />
        <StatChip label="Bookings" value={countBookings} />
        <ManagerToggle name={p.name} venueManager={!!p.venueManager} />
      </section>

      {/* Upcoming bookings */}
      <section className="space-y-3" aria-labelledby="upcoming-heading">
        <div className="flex items-center justify-between">
          <h2 id="upcoming-heading" className="text-xl font-semibold">
            Upcoming bookings
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
        ) : bookings.length === 0 ? (
          <EmptyBookings />
        ) : (
          // Use list semantics
          <ul className="grid gap-3">
            {bookings.map((b) => (
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
      </section>
    </div>
  );
}
