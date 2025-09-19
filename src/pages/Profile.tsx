import { useAuth } from "@/features/auth/store";
import { useProfile } from "@/features/profile/hooks";
import { ProfileHeaderSkeleton } from "@/features/profile/ProfileHeaderSkeleton";
import { AvatarBlock } from "@/features/profile/AvatarBlock";
import { StatChip } from "@/features/profile/StatChip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AvatarDialog } from "@/features/profile/AvatarDialog";

export default function Profile() {
  const { profile: authProfile } = useAuth();
  const name = authProfile?.name;

  const { data: p, isLoading, isError, refetch, isFetching } = useProfile(name);

  const [openAvatar, setOpenAvatar] = useState(false);

  if (isLoading) return <ProfileHeaderSkeleton />;
  if (isError || !p) {
    return (
      <div className="space-y-3">
        <p className="text-destructive">Couldn’t load your profile.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const countVenues = p._count?.venues ?? p.venues?.length;
  const countBookings = p._count?.bookings ?? p.bookings?.length;

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="rounded-xl border bg-muted h-24 w-full" />

      <section className="flex items-center gap-4">
        <AvatarBlock
          url={p.avatar?.url}
          alt={p.avatar?.alt}
          name={p.name}
          size={72}
        />
        <div>
          <h1 className="text-2xl font-semibold">{p.name}</h1>
          <p className="text-muted-foreground text-sm">{p.email}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={p.venueManager ? "default" : "secondary"}>
              {p.venueManager ? "Venue manager" : "Customer"}
            </Badge>
            {isFetching && (
              <span className="text-xs text-muted-foreground">Refreshing…</span>
            )}
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={() => setOpenAvatar(true)}>
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

      <section className="flex gap-2">
        <StatChip label="Venues" value={countVenues} />
        <StatChip label="Bookings" value={countBookings} />
      </section>

      {/* Future sections (TODO) */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Upcoming bookings</h2>
        <p className="text-muted-foreground text-sm">
          We’ll list them here in the next task.
        </p>
      </section>
    </div>
  );
}
