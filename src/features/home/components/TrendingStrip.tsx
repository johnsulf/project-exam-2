import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { routes } from "@/router/routes";

export type TrendingStripProps = {
  venues: Array<{
    id: string;
    name: string;
    media?: { url: string; alt?: string }[];
    location?: { city?: string | null; country?: string | null };
    rating?: number | null;
  }>;
};

export function TrendingStrip({ venues }: TrendingStripProps) {
  return (
    <div className="space-y-6">
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
          <Link to={routes.venues}>
            View all
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:gap-4 lg:overflow-x-auto lg:pb-2 xl:grid xl:grid-cols-3 xl:overflow-visible">
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
            <Link
              key={venue.id}
              to={routes.venue(venue.id)}
              className="group flex items-center gap-4 rounded-lg border border-white/10 bg-indigo-50 p-3 transition hover:bg-indigo-100 hover:shadow-lg lg:min-w-xs xl:min-w-0"
            >
              <div className="relative h-20 w-24 overflow-hidden rounded-lg">
                {cover?.url ? (
                  <img
                    src={cover.url}
                    alt={cover.alt || venue.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-card/20 text-xs text-white/70">
                    No image
                  </div>
                )}
                <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 text-white py-0.5 text-[10px] font-medium">
                  <Star className="size-3 text-yellow-400" aria-hidden="true" />
                  {rating}
                </span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full text-teal-950  bg-teal-100 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                    Limited
                  </span>
                </div>
                <p className="text-sm font-semibold">{venue.name}</p>
                <p className="text-xs ">{locationLabel}</p>
              </div>
              <ArrowRight
                className="size-4 shrink-0 opacity-60 transition group-hover:translate-x-1 group-hover:opacity-100"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
