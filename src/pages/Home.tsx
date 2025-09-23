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

  const byCity = (name: string) =>
    all
      .filter((v) => (v.location?.city ?? "").toLowerCase() === name)
      .slice(0, 3);

  const oslo = byCity("oslo");
  const bergen = byCity("bergen");

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

          <FeaturedSection
            title="Visit Norways capital! 🇳🇴"
            cta={{ to: "/venues?city=oslo", label: "See all in Oslo" }}
            items={oslo}
            emptyText="No highly rated venues in Oslo yet."
          />

          <FeaturedSection
            title="Bergen? Raincheck! 🌧️"
            cta={{ to: "/venues?city=bergen", label: "See all in Bergen" }}
            items={bergen}
            emptyText="No highly rated venues in Bergen yet."
          />
        </>
      )}
    </div>
  );
}
