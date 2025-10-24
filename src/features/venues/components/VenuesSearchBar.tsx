import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Props = {
  redirectTo?: string;
};

export function VenuesSearchBar({ redirectTo }: Props) {
  const navigate = useNavigate();
  const [urlParams, setUrlParams] = useSearchParams();
  const [datesOpen, setDatesOpen] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = React.useState(false);
  const queryId = React.useId();
  const guestId = React.useId();

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
  const amenityOptions = [
    { key: "wifi", label: "WiFi", value: wifi, setValue: setWifi },
    { key: "parking", label: "Parking", value: parking, setValue: setParking },
    { key: "pets", label: "Pets", value: pets, setValue: setPets },
    {
      key: "breakfast",
      label: "Breakfast",
      value: breakfast,
      setValue: setBreakfast,
    },
  ];

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

    if (redirectTo) {
      navigate({ pathname: redirectTo, search: `?${p.toString()}` });
    } else {
      setUrlParams(p, { replace: true });
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    applyToUrl();
  }

  const renderSearchField = (
    wrapperClassName?: string,
    inputClassName?: string,
  ) => (
    <div className={cn("flex items-center gap-2", wrapperClassName)}>
      <Search
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <div className="flex-1">
        <Label htmlFor={queryId} className="sr-only">
          Search venues
        </Label>
        <Input
          id={queryId}
          placeholder="Search by name, city, country…"
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          className={cn("w-full", inputClassName)}
        />
      </div>
    </div>
  );

  const renderGuestField = (
    wrapperClassName?: string,
    inputClassName?: string,
  ) => (
    <div className={cn("flex items-center gap-2", wrapperClassName)}>
      <Users
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <div className="flex-1">
        <Label htmlFor={guestId} className="sr-only">
          Guests
        </Label>
        <Input
          id={guestId}
          type="number"
          min={1}
          inputMode="numeric"
          placeholder="Guests"
          value={guests}
          onChange={(e) => setGuests(e.currentTarget.value)}
          className={cn("w-full sm:w-28", inputClassName)}
        />
      </div>
    </div>
  );

  const renderDateField = (
    wrapperClassName?: string,
    buttonClassName?: string,
  ) => (
    <div className={cn(wrapperClassName)}>
      <Popover open={datesOpen} onOpenChange={setDatesOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start gap-2 w-full lg:w-[240px]",
              buttonClassName,
            )}
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
    </div>
  );

  const renderFiltersField = (
    wrapperClassName?: string,
    buttonClassName?: string,
  ) => (
    <div className={cn(wrapperClassName)}>
      <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("gap-2 w-full lg:w-auto", buttonClassName)}
          >
            <Filter className="size-4" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56">
          <div className="space-y-2">
            {amenityOptions.map(({ key, label, value, setValue }) => (
              <Label
                key={key}
                htmlFor={`filter-${key}`}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  id={`filter-${key}`}
                  checked={value}
                  onCheckedChange={(checked) => setValue(checked === true)}
                />
                {label}
              </Label>
            ))}
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
    </div>
  );

  return (
    <div className="rounded-xl border p-3 md:p-4 mb-4 bg-card">
      <div className="md:hidden">
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-center gap-2">
              <Search className="size-4" />
              Search venues
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="p-0">
            <SheetHeader className="px-4 pt-4 pb-2">
              <SheetTitle>Search venues</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-4 space-y-4">
              <form onSubmit={onSubmit} className="space-y-4">
                {renderSearchField()}
                {renderGuestField()}
                {renderDateField(undefined, "w-full")}
                {renderFiltersField()}
                <Button type="submit" className="w-full">
                  <Search className="size-4 mr-2" />
                  Apply search
                </Button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <form
        onSubmit={onSubmit}
        className="hidden gap-3 md:grid md:grid-cols-2 md:items-start lg:flex lg:flex-wrap lg:items-center"
      >
        {renderSearchField("md:col-span-2 lg:flex-1", "lg:w-full")}
        {renderGuestField("md:col-span-1 lg:w-auto lg:flex lg:items-center")}
        {renderDateField("md:col-span-1 lg:w-auto", "md:w-full lg:w-[240px]")}
        {renderFiltersField("md:col-span-1 lg:w-auto")}
        <div className="md:col-span-1 lg:ml-auto lg:w-auto">
          <Button type="submit" className="w-full md:w-auto">
            <Search className="size-4 mr-2" />
            Search
          </Button>
        </div>
      </form>
    </div>
  );
}
