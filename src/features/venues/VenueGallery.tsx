import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Media = { url: string; alt?: string };

type Props = {
  media: Media[];
  venueName: string;
  className?: string;
};

export function VenueGallery({ media, venueName, className }: Props) {
  const images = useMemo(
    () => (Array.isArray(media) ? media.filter((m) => !!m?.url) : []),
    [media],
  );
  const [index, setIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  if (!images.length) {
    return (
      <div className={cn("overflow-hidden rounded-xl border", className)}>
        <div className="aspect-[4/3] grid place-items-center text-sm text-muted-foreground">
          No image available
        </div>
      </div>
    );
  }

  const main = images[Math.min(index, images.length - 1)];
  const hasThumbs = images.length > 1;

  function select(i: number) {
    setIndex(i);
    const el = listRef.current?.querySelector<HTMLButtonElement>(
      `[data-idx="${i}"]`,
    );
    el?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main */}
      <div className="overflow-hidden rounded-xl border">
        <img
          src={main.url}
          alt={main.alt || venueName}
          className="w-full aspect-[4/3] object-cover"
        />
      </div>

      {/* Thumbnails */}
      {hasThumbs && (
        <div
          ref={listRef}
          role="listbox"
          aria-label="Choose image"
          className="flex gap-3 overflow-x-auto pb-1"
        >
          {images.map((m, i) => (
            <button
              key={m.url + i}
              role="option"
              aria-selected={i === index}
              data-idx={i}
              onClick={() => select(i)}
              className={cn(
                "shrink-0 overflow-hidden rounded-xl border",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                i === index ? "ring-2 ring-ring" : "",
              )}
            >
              <img
                src={m.url}
                alt={m.alt || `${venueName} thumbnail ${i + 1}`}
                className="h-24 w-32 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
