import { Button } from "@/components/ui/button";
import { VenuesSearchBar } from "@/features/venues/components/VenuesSearchBar";
import { useVenues } from "@/features/venues/hooks";
import { VenueListSkeleton } from "@/components/skeletons/VenueListSkeleton";
import { FeaturedSection } from "@/features/home/components/FeaturedSection";
import {
  ArrowRight,
  CalendarCheck,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";

export default function Home() {
  // one fetch, then derive sections
  const { data, isLoading, isError, refetch } = useVenues({
    page: 1,
    limit: 100,
  });

  const all = data?.data ?? [];

  // Featured: top 6 by rating (fallback rating 0)
  const featured = [...all]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(27, 33);

  const cityGroups = new Map<
    string,
    { slug: string; label: string; venues: typeof all }
  >();

  for (const venue of all) {
    const rawCity = venue.location?.city?.trim();
    if (!rawCity) continue;
    const slug = rawCity.toLowerCase();
    const label = rawCity
      .split(/[\s-]+/)
      .map((part) =>
        part
          ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
          : part,
      )
      .join(" ");
    const existing = cityGroups.get(slug);
    if (existing) {
      existing.venues.push(venue);
    } else {
      cityGroups.set(slug, { slug, label, venues: [venue] });
    }
  }

  const citySections = Array.from(cityGroups.values())
    .filter((group) => group.venues.length > 0)
    .sort((a, b) => b.venues.length - a.venues.length)
    .slice(0, 2)
    .map((group) => ({
      ...group,
      venues: [...group.venues]
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 3),
    }));

  const heroHighlight = featured.slice(0, 3);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero */}
      <section className="overflow-hidden rounded-[32px] border bg-white shadow-xl">
        <div className="px-6 py-12 sm:px-10 md:px-16 lg:px-20 space-y-12">
          <div className="max-w-3xl space-y-6 ">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1 text-sm font-medium backdrop-blur-sm">
              <Sparkles className="size-4" aria-hidden="true" />
              Handpicked stays, just for you
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
              Escape the ordinary. Discover inspiring places to stay with
              Holidaze.
            </h1>
            <p className="text-base sm:text-lg /80 max-w-2xl">
              Browse design-led apartments, eco-friendly cabins, and beachfront
              getaways curated from hosts across the globe. Search by city,
              filter by amenities, and book with confidence in seconds.
            </p>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/95 p-4 sm:p-5 shadow-2xl backdrop-blur">
              <VenuesSearchBar redirectTo="/venues" />
              <div className="grid gap-3 sm:grid-cols-3 text-sm text-slate-600">
                <StatPill
                  icon={<MapPin className="size-4" aria-hidden="true" />}
                  label="Featured stays"
                  value={featured.length}
                />
                <StatPill
                  icon={<CalendarCheck className="size-4" aria-hidden="true" />}
                  label="Available now"
                  value={Math.max(all.length - featured.length, 12)}
                />
                <StatPill
                  icon={<ShieldCheck className="size-4" aria-hidden="true" />}
                  label="Host guarantee"
                  value="24/7"
                />
              </div>
            </div>

            {heroHighlight.length > 0 && (
              <TrendingStrip venues={heroHighlight} />
            )}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="grid gap-6 md:grid-cols-3">
        <HighlightCard
          title="Curated for inspiration"
          description="Every venue on Holidaze is handpicked for its stories, architecture, or location—so every trip feels special."
        />
        <HighlightCard
          title="Always in the know"
          description="Realtime availability and smart filters help you find the perfect stay faster than ever."
        />
        <HighlightCard
          title="Secure bookings"
          description="Instant confirmations, transparent pricing, and host support the moment you arrive."
        />
      </section>

      {isLoading ? (
        <VenueListSkeleton count={6} />
      ) : isError ? (
        <div className="space-y-2">
          <p className="text-destructive">Couldn’t load venues.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      ) : (
        <>
          <FeaturedSection
            title="Featured Venues"
            cta={{ to: "/venues", label: "See all Venues" }}
            items={featured}
          />

          <section className="rounded-3xl bg-white border p-8 md:p-10 space-y-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">
                  Plan your next escape
                </h2>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  From dreaming to confirming, Holidaze keeps every step simple.
                  Create a wishlist, share it with friends, and book the moment
                  you’re ready.
                </p>
              </div>
              <Button asChild>
                <a href="/venues">
                  Start exploring
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </section>

          {citySections.map(({ slug, label, venues }) => (
            <FeaturedSection
              key={slug}
              title={`Top stays in ${label}`}
              cta={{
                to: `/venues?city=${encodeURIComponent(slug)}`,
                label: `See all in ${label}`,
              }}
              items={venues}
              emptyText={`No popular venues in ${label} yet.`}
            />
          ))}
        </>
      )}
    </div>
  );
}

type TrendingStripProps = {
  venues: Array<{
    id: string;
    name: string;
    media?: { url: string; alt?: string }[];
    location?: { city?: string | null; country?: string | null };
    rating?: number | null;
  }>;
};

function TrendingStrip({ venues }: TrendingStripProps) {
  return (
    <div className="space-y-4 rounded-3xl border border-white/20 bg-white/15 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] ">
            Trending this week
          </p>
          <h2 className="text-xl font-semibold">
            Hot picks from the Holidaze community
          </h2>
          <p className="text-sm ">
            Handpicked stays guests are loving right now. Limited availability.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href="/venues">
            View all
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {venues.map((venue) => {
          const cover = venue.media?.[0];
          const locationLabel =
            venue.location?.city && venue.location?.country
              ? `${venue.location.city}, ${venue.location.country}`
              : (venue.location?.city ??
                venue.location?.country ??
                "Worldwide");
          const rating =
            typeof venue.rating === "number" && venue.rating > 0
              ? venue.rating.toPrecision(2)
              : "No ratings";

          return (
            <a
              key={venue.id}
              href={`/venues/${venue.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-indigo-50 p-3 transition hover:bg-indigo-100 hover:shadow-lg"
            >
              <div className="relative h-20 w-24 overflow-hidden rounded-xl">
                {cover?.url ? (
                  <img
                    src={cover.url}
                    alt={cover.alt || venue.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/20 text-xs text-white/70">
                    No image
                  </div>
                )}
                <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 text-white py-0.5 text-[10px] font-medium">
                  <Star className="size-3 text-yellow-400" aria-hidden="true" />
                  {rating}
                </span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full text-white  bg-indigo-600 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                    Limited
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[10px] uppercase tracking-wide">
                    Top rated
                  </span>
                </div>
                <p className="text-sm font-semibold">{venue.name}</p>
                <p className="text-xs ">{locationLabel}</p>
              </div>
              <ArrowRight
                className="size-4 shrink-0 opacity-60 transition group-hover:translate-x-1 group-hover:opacity-100"
                aria-hidden="true"
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}

type StatPillProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

function StatPill({ icon, label, value }: StatPillProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/80 px-4 py-3 shadow-sm">
      <span className="flex size-8 items-center justify-center rounded-full bg-slate-900/5 text-slate-700">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

type HighlightCardProps = {
  title: string;
  description: string;
};

function HighlightCard({ title, description }: HighlightCardProps) {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
