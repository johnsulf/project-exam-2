import { Button } from "@/components/ui/button";
import { VenuesSearchBar } from "@/features/venues/components/VenuesSearchBar";
import { useVenues } from "@/features/venues/hooks";
import { VenueListSkeleton } from "@/components/skeletons/VenueListSkeleton";
import { FeaturedSection } from "@/features/home/components/FeaturedSection";

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
    .slice(0, 6);

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

  return (
    <div className="space-y-8">
      {/* Showcase / hero */}
      <section className="rounded-2xl bg-muted/40 border p-6 md:p-10">
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Find your next stay
          </h1>
          <p className="text-sm text-muted-foreground">
            Search thousands of venues world wide
          </p>
        </div>
        <div className="mx-auto mt-4 max-w-4xl">
          <VenuesSearchBar redirectTo="/venues" />
        </div>
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
