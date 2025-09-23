import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarIcon, Filter, Search, Users } from "lucide-react";
import type { DateRange } from "react-day-picker";

export function VenuesSearchBar() {
  const [urlParams, setUrlParams] = useSearchParams();
  const [datesOpen, setDatesOpen] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  React.useEffect(() => {
    setQ(urlParams.get("q") ?? "");
    setGuests(urlParams.get("guests") ?? "");
    const from = urlParams.get("from");
    const to = urlParams.get("to");
    setRange(
      from || to
        ? {
            from: from ? new Date(from) : undefined,
            to: to ? new Date(to) : undefined,
          }
        : undefined,
    );
    setWifi(urlParams.get("wifi") === "1");
    setParking(urlParams.get("parking") === "1");
    setPets(urlParams.get("pets") === "1");
    setBreakfast(urlParams.get("breakfast") === "1");
  }, [urlParams]);

  const [q, setQ] = React.useState(urlParams.get("q") ?? "");
  const [guests, setGuests] = React.useState(urlParams.get("guests") ?? "");
  const [range, setRange] = React.useState<DateRange | undefined>(() => {
    const from = urlParams.get("from");
    const to = urlParams.get("to");
    return from || to
      ? {
          from: from ? new Date(from) : undefined,
          to: to ? new Date(to) : undefined,
        }
      : undefined;
  });
  const [wifi, setWifi] = React.useState(urlParams.get("wifi") === "1");
  const [parking, setParking] = React.useState(
    urlParams.get("parking") === "1",
  );
  const [pets, setPets] = React.useState(urlParams.get("pets") === "1");
  const [breakfast, setBreakfast] = React.useState(
    urlParams.get("breakfast") === "1",
  );

  React.useEffect(() => {
    setQ(urlParams.get("q") ?? "");
    setGuests(urlParams.get("guests") ?? "");
    const from = urlParams.get("from");
    const to = urlParams.get("to");
    setRange(
      from || to
        ? {
            from: from ? new Date(from) : undefined,
            to: to ? new Date(to) : undefined,
          }
        : undefined,
    );
    setWifi(urlParams.get("wifi") === "1");
    setParking(urlParams.get("parking") === "1");
    setPets(urlParams.get("pets") === "1");
    setBreakfast(urlParams.get("breakfast") === "1");
  }, [urlParams]);

  function applyToUrl() {
    const p = new URLSearchParams(urlParams);
    const setOrDelete = (k: string, v?: string | null) => {
      if (!v) p.delete(k);
      else p.set(k, v);
    };

    setOrDelete("q", q.trim() || null);
    setOrDelete("guests", guests || null);

    setOrDelete(
      "from",
      range?.from ? range.from.toISOString().slice(0, 10) : null,
    );
    setOrDelete("to", range?.to ? range.to.toISOString().slice(0, 10) : null);

    setOrDelete("wifi", wifi ? "1" : null);
    setOrDelete("parking", parking ? "1" : null);
    setOrDelete("pets", pets ? "1" : null);
    setOrDelete("breakfast", breakfast ? "1" : null);

    p.set("page", "1");
    setUrlParams(p, { replace: true });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    applyToUrl();
  }

  return (
    <div className="rounded-xl border p-3 md:p-4 mb-4 bg-card">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 md:flex-row md:items-center"
      >
        <div className="flex-1 flex items-center gap-2">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <Input
            placeholder="Search by name, city, country…"
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Users className="size-4 shrink-0 text-muted-foreground" />
          <Input
            type="number"
            min={1}
            inputMode="numeric"
            placeholder="Guests"
            value={guests}
            onChange={(e) => setGuests(e.currentTarget.value)}
            className="w-28"
          />
        </div>

        <Popover open={datesOpen} onOpenChange={setDatesOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start gap-2 w-full md:w-[220px]"
            >
              <CalendarIcon className="size-4" />
              {range?.from
                ? range.to
                  ? `${range.from.toLocaleDateString()} – ${range.to.toLocaleDateString()}`
                  : range.from.toLocaleDateString()
                : "Pick dates"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={range}
              onSelect={setRange}
            />
            <Separator />
            <div className="p-2 flex justify-between">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setRange(undefined);
                  applyToUrl();
                  setDatesOpen(false);
                }}
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  applyToUrl();
                  setDatesOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 w-full md:w-auto">
              <Filter className="size-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wifi}
                  onChange={() => setWifi((v) => !v)}
                />{" "}
                WiFi
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={parking}
                  onChange={() => setParking((v) => !v)}
                />{" "}
                Parking
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pets}
                  onChange={() => setPets((v) => !v)}
                />{" "}
                Pets
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={breakfast}
                  onChange={() => setBreakfast((v) => !v)}
                />{" "}
                Breakfast
              </label>
              <Separator />
              <div className="flex justify-between">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setWifi(false);
                    setParking(false);
                    setPets(false);
                    setBreakfast(false);
                    applyToUrl();
                    setFiltersOpen(false);
                  }}
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    applyToUrl();
                    setFiltersOpen(false);
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button type="submit" className="md:ml-auto">
          <Search className="size-4 mr-2" />
          Search
        </Button>
      </form>
    </div>
  );
}
