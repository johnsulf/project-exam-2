import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { VenuesSearchBar } from "@/features/venues/components/VenuesSearchBar";
import { useVenues } from "@/features/venues/hooks";
import { VenueListSkeleton } from "@/components/skeletons/VenueListSkeleton";
import { FeaturedSection } from "@/features/home/components/FeaturedSection";
import { StatPill } from "@/features/home/components/StatPill";
import { TrendingStrip } from "@/features/home/components/TrendingStrip";
import { HighlightCard } from "@/features/home/components/HighlightCard";
import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";
import {
  ArrowRight,
  CalendarCheck,
  Heart,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { routes } from "@/router/routes";

export default function Home() {
  const { data, isLoading, isError, refetch } = useVenues({
    page: 1,
    limit: 100,
  });

  const all = data?.data ?? [];

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

  const breadcrumbs = [{ label: "Home" }];

  return (
    <div className="space-y-6 pb-12">
      <PageBreadcrumbs items={breadcrumbs} />
      <div className="space-y-20">
        {/* Hero */}
        <section className="overflow-hidden space-y-12 rounded-lg border bg-card p-8 md:p-12">
          {/* Hero header */}
          <div className="max-w-3xl sm:p-4  space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full text-teal-950 bg-teal-100 px-4 py-1 font-medium">
              <Heart aria-hidden="true" />
              Handpicked stays, just for you
            </span>
            <h1>
              Escape the ordinary. Discover inspiring places to stay with
              Holidaze.
            </h1>
            <p className="sm:text-lg max-w-2xl">
              Browse design-led apartments, eco-friendly cabins, and beachfront
              getaways curated from hosts across the globe. Search by city,
              filter by amenities, and book with confidence in seconds.
            </p>
          </div>

          {/* Search bar */}
          <VenuesSearchBar redirectTo="/venues" />

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatPill
              icon={<MapPin aria-hidden="true" />}
              label="Featured stays"
              value={featured.length}
            />
            <StatPill
              icon={<CalendarCheck aria-hidden="true" />}
              label="Available now"
              value={Math.max(all.length - featured.length, 12)}
            />
            <StatPill
              icon={<ShieldCheck aria-hidden="true" />}
              label="Host guarantee"
              value="24/7"
            />
          </div>

          {/* Trending stays */}
          <TrendingStrip venues={featured.slice(0, 3)} />
        </section>

        {/* Highlights */}
        <section className="grid gap-6 md:grid-cols-3">
          <HighlightCard
            title="Curated for inspiration"
            description="Every venue on Holidaze is handpicked for its stories, architecture, or location - so every trip feels special."
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

            <section className="rounded-lg bg-card border p-8 md:p-10 space-y-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2>Plan your next escape</h2>
                  <p className="text-muted-foreground max-w-2xl">
                    From dreaming to confirming, Holidaze keeps every step
                    simple. Create a wishlist, share it with friends, and book
                    the moment you’re ready.
                  </p>
                </div>
                <Button asChild>
                  <Link to={routes.venues}>
                    Start exploring
                    <ArrowRight aria-hidden="true" />
                  </Link>
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
    </div>
  );
}
