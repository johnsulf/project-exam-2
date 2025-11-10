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
import {
  Calendar as CalendarIcon,
  Filter,
  Search,
  Users,
  X,
} from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  redirectTo?: string;
  loading?: boolean;
};

export function VenuesSearchBar({ redirectTo, loading = false }: Props) {
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

  const resetAmenities = React.useCallback(() => {
    setWifi(false);
    setParking(false);
    setPets(false);
    setBreakfast(false);
  }, []);

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
    setMobileSheetOpen(false);
    setDatesOpen(false);
    setFiltersOpen(false);
  }

  return (
    <div className="rounded-xl border p-3 md:p-4 mb-4 bg-card">
      <MobileSearchSheet
        open={mobileSheetOpen}
        onOpenChange={setMobileSheetOpen}
        onSubmit={onSubmit}
        loading={loading}
        searchProps={{
          id: queryId,
          value: q,
          onChange: setQ,
        }}
        guestProps={{
          id: guestId,
          value: guests,
          onChange: setGuests,
        }}
        range={range}
        onRangeChange={setRange}
        amenityOptions={amenityOptions}
        onResetAmenities={resetAmenities}
      />
      <DesktopSearchForm
        onSubmit={onSubmit}
        loading={loading}
        searchProps={{
          id: queryId,
          value: q,
          onChange: setQ,
        }}
        guestProps={{
          id: guestId,
          value: guests,
          onChange: setGuests,
        }}
        dateProps={{
          range,
          onSelect: setRange,
          open: datesOpen,
          onOpenChange: setDatesOpen,
          onApply: () => {
            applyToUrl();
            setDatesOpen(false);
          },
          onClear: () => {
            setRange(undefined);
            applyToUrl();
            setDatesOpen(false);
          },
        }}
        filterProps={{
          options: amenityOptions,
          open: filtersOpen,
          onOpenChange: setFiltersOpen,
          onApply: () => {
            applyToUrl();
            setFiltersOpen(false);
          },
          onClear: () => {
            resetAmenities();
            applyToUrl();
            setFiltersOpen(false);
          },
        }}
      />
    </div>
  );
}

type SearchControlProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
};

type GuestControlProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
};

type DateControlProps = {
  range?: DateRange;
  onSelect: (range: DateRange | undefined) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: () => void;
  onClear: () => void;
  className?: string;
  buttonClassName?: string;
};

type AmenityOption = {
  key: string;
  label: string;
  value: boolean;
  setValue: (value: boolean) => void;
};

type FiltersControlProps = {
  options: AmenityOption[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: () => void;
  onClear: () => void;
  className?: string;
  buttonClassName?: string;
};

type MobileSearchSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  searchProps: SearchControlProps;
  guestProps: GuestControlProps;
  range?: DateRange;
  onRangeChange: (range: DateRange | undefined) => void;
  amenityOptions: AmenityOption[];
  onResetAmenities: () => void;
};

type DesktopSearchFormProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  searchProps: SearchControlProps;
  guestProps: GuestControlProps;
  dateProps: DateControlProps;
  filterProps: FiltersControlProps;
};

type InlineDatePickerProps = {
  range?: DateRange;
  onSelect: (range: DateRange | undefined) => void;
  onClear: () => void;
};

type InlineAmenityListProps = {
  options: AmenityOption[];
  onClear: () => void;
};

type FieldShellProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

function FieldShell({ icon, children, className }: FieldShellProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {icon}
      <div className="flex-1">{children}</div>
    </div>
  );
}

function SearchControl({
  id,
  value,
  onChange,
  className,
  inputClassName,
}: SearchControlProps) {
  return (
    <FieldShell
      className={className}
      icon={
        <Search
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      }
    >
      <Label htmlFor={id} className="sr-only">
        Search venues
      </Label>
      <Input
        id={id}
        placeholder="Search by name, city, country…"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        className={cn("w-full", inputClassName)}
      />
    </FieldShell>
  );
}

function GuestControl({
  id,
  value,
  onChange,
  className,
  inputClassName,
}: GuestControlProps) {
  return (
    <FieldShell
      className={className}
      icon={
        <Users
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      }
    >
      <Label htmlFor={id} className="sr-only">
        Guests
      </Label>
      <Input
        id={id}
        type="number"
        min={1}
        inputMode="numeric"
        placeholder="Guests"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        className={cn("w-full", inputClassName)}
      />
    </FieldShell>
  );
}

function DateRangeControl({
  range,
  onSelect,
  open,
  onOpenChange,
  onApply,
  onClear,
  className,
  buttonClassName,
}: DateControlProps) {
  return (
    <div className={className}>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-center gap-2 text-center",
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
        <PopoverContent className="w-auto p-0 z-[60]" align="end">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={onSelect}
          />
          <Separator />
          <div className="p-2 flex justify-between">
            <Button size="sm" variant="ghost" onClick={onClear}>
              Clear
            </Button>
            <Button size="sm" onClick={onApply}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function FiltersControl({
  options,
  open,
  onOpenChange,
  onApply,
  onClear,
  className,
  buttonClassName,
}: FiltersControlProps) {
  return (
    <div className={className}>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("gap-2 w-full justify-center", buttonClassName)}
          >
            <Filter className="size-4" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56 z-[60]">
          <div className="space-y-2">
            {options.map(({ key, label, value, setValue }) => (
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
              <Button size="sm" variant="ghost" onClick={onClear}>
                Clear
              </Button>
              <Button size="sm" onClick={onApply}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function MobileSearchSheet({
  open,
  onOpenChange,
  onSubmit,
  loading,
  searchProps,
  guestProps,
  range,
  onRangeChange,
  amenityOptions,
  onResetAmenities,
}: MobileSearchSheetProps) {
  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button variant="default" className="w-full justify-center gap-2">
            <Search className="size-4" />
            Search venues
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="p-0 max-h-[70dvh]">
          <SheetHeader className="px-4 pt-4 pb-2 flex items-center justify-between space-y-0">
            <SheetTitle>Search venues</SheetTitle>
            <SheetClose asChild>
              <Button variant="outline" aria-label="Close search panel">
                <X className="size-5" aria-hidden="true" />
                Cancel
              </Button>
            </SheetClose>
          </SheetHeader>
          <div className="px-4 pb-4 space-y-4">
            <form onSubmit={onSubmit} className="space-y-4">
              <SearchControl {...searchProps} />
              <GuestControl {...guestProps} />
              <InlineDatePicker
                range={range}
                onSelect={onRangeChange}
                onClear={() => onRangeChange(undefined)}
              />
              <InlineAmenityList
                options={amenityOptions}
                onClear={onResetAmenities}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <Spinner className="mr-2" />
                ) : (
                  <Search className="size-4 mr-2" />
                )}
                Apply search
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DesktopSearchForm({
  onSubmit,
  loading,
  searchProps,
  guestProps,
  dateProps,
  filterProps,
}: DesktopSearchFormProps) {
  return (
    <form onSubmit={onSubmit} className="hidden md:flex md:flex-col gap-4">
      <div className="w-full">
        <SearchControl {...searchProps} className="w-full" />
      </div>

      <div className="w-full grid gap-3 md:grid-cols-3">
        <GuestControl
          {...guestProps}
          className="w-full min-w-0"
          inputClassName="w-full"
        />
        <DateRangeControl {...dateProps} className="w-full min-w-0" />
        <FiltersControl {...filterProps} className="w-full min-w-0" />
      </div>

      <div className="w-full">
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <Spinner className="mr-2" />
          ) : (
            <Search className="size-4 mr-2" />
          )}
          Search
        </Button>
      </div>
    </form>
  );
}

function InlineDatePicker({ range, onSelect, onClear }: InlineDatePickerProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Dates</div>
        <Button size="sm" variant="ghost" type="button" onClick={onClear}>
          Clear
        </Button>
      </div>
      <Calendar
        mode="range"
        numberOfMonths={1}
        selected={range}
        onSelect={onSelect}
      />
    </div>
  );
}

function InlineAmenityList({ options, onClear }: InlineAmenityListProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Filters</div>
        <Button size="sm" variant="ghost" type="button" onClick={onClear}>
          Clear
        </Button>
      </div>
      <div className="space-y-2">
        {options.map(({ key, label, value, setValue }) => (
          <Label
            key={key}
            htmlFor={`inline-filter-${key}`}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              id={`inline-filter-${key}`}
              checked={value}
              onCheckedChange={(checked) => setValue(checked === true)}
            />
            {label}
          </Label>
        ))}
      </div>
    </div>
  );
}
