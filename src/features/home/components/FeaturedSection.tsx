import { Button } from "@/components/ui/button";
import { VenueCard } from "@/features/venues/components/VenueCard";
import type { Venue } from "@/types/api";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function FeaturedSection({
  title,
  cta,
  items,
  emptyText = "No venues found.",
}: {
  title: string;
  cta: { to: string; label: string };
  items: Venue[];
  emptyText?: string;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold">{title}</h2>
        <Button asChild variant="outline">
          <Link to={cta.to}>
            {cta.label} <ArrowRight />
          </Link>
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((v) => (
            <VenueCard key={v.id} v={v} />
          ))}
        </div>
      )}
    </section>
  );
}
