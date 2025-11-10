import { Star } from "lucide-react";

export type RatingStarsProps = {
  value: number;
  onSelect: (value: number) => void;
  disabled?: boolean;
};

export function RatingStars({ value, onSelect, disabled }: RatingStarsProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label="Rate this venue"
    >
      {stars.map((star) => {
        const selected = value >= star;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={selected}
            className="rounded-full p-1 text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            onClick={() => onSelect(star)}
            disabled={disabled}
          >
            <Star
              className={selected ? "size-5 text-yellow-500" : "size-5"}
              fill={selected ? "currentColor" : "none"}
              strokeWidth={selected ? 1.5 : 1.8}
            />
            <span className="sr-only">{`Rate ${star} star${star === 1 ? "" : "s"}`}</span>
          </button>
        );
      })}
    </div>
  );
}
