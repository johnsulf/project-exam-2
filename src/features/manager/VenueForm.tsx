import { useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import { VenueCreate, type TVenue, type TVenueCreate } from "@/types/schemas";

const BASE_DEFAULTS: TVenueCreate = {
  name: "",
  description: "",
  media: [],
  price: 0,
  maxGuests: 1,
  rating: 0,
  meta: { wifi: false, parking: false, breakfast: false, pets: false },
  location: {
    address: "",
    city: "",
    zip: "",
    country: "",
    continent: "",
    lat: null,
    lng: null,
  },
};

function resolveVenueDefaults(values?: Partial<TVenueCreate>): TVenueCreate {
  if (!values) {
    return structuredClone(BASE_DEFAULTS);
  }

  const defaults = structuredClone(BASE_DEFAULTS);
  return {
    ...defaults,
    ...values,
    media: values.media
      ? values.media.map((item) => ({
          url: item?.url ?? "",
          alt: item?.alt ?? "",
        }))
      : defaults.media,
    meta: {
      ...defaults.meta,
      ...(values.meta ?? {}),
    },
    location: values.location
      ? {
          ...defaults.location,
          ...values.location,
        }
      : defaults.location,
  };
}

function sanitizeVenueValues(values: TVenueCreate): TVenueCreate {
  const media = (values.media ?? [])
    .filter((item) => item?.url?.trim())
    .map((item) => ({
      url: item.url.trim(),
      alt: item.alt?.trim() ? item.alt.trim() : undefined,
    }));

  const location = values.location
    ? Object.entries(values.location).some(
        ([, v]) => v !== null && v !== undefined && String(v).trim() !== "",
      )
      ? {
          ...values.location,
          address: values.location.address?.trim() || undefined,
          city: values.location.city?.trim() || undefined,
          zip: values.location.zip?.trim() || undefined,
          country: values.location.country?.trim() || undefined,
          continent: values.location.continent?.trim() || undefined,
        }
      : undefined
    : undefined;

  return {
    ...values,
    media,
    location,
    meta: values.meta ?? undefined,
  };
}

function isFieldError(value: unknown): value is FieldError {
  return (
    !!value &&
    typeof value === "object" &&
    "type" in (value as Record<string, unknown>)
  );
}

function findFirstErrorName(errors: FieldErrors<TVenueCreate>): string | null {
  for (const value of Object.values(errors)) {
    if (!value) continue;

    if (Array.isArray(value)) {
      for (const entry of value) {
        const nested = findFirstErrorName(entry as FieldErrors<TVenueCreate>);
        if (nested) return nested;
      }
      continue;
    }

    if (isFieldError(value)) {
      return value.ref?.name ?? null;
    }

    if (typeof value === "object") {
      const nested = findFirstErrorName(value as FieldErrors<TVenueCreate>);
      if (nested) return nested;
    }
  }

  return null;
}

type VenueFormProps = {
  defaultValues?: Partial<TVenueCreate>;
  onSubmit: (values: TVenueCreate) => Promise<void> | void;
  submitLabel: string;
  pendingLabel?: string;
  isSubmitting?: boolean;
  secondaryAction?: ReactNode;
};

export function venueToFormValues(venue: TVenue): TVenueCreate {
  return resolveVenueDefaults({
    name: venue.name,
    description: venue.description,
    media: (venue.media ?? []).map((m) => ({ url: m.url, alt: m.alt ?? "" })),
    price: venue.price,
    maxGuests: venue.maxGuests,
    rating: typeof venue.rating === "number" ? venue.rating : 0,
    meta: {
      wifi: !!venue.meta?.wifi,
      parking: !!venue.meta?.parking,
      breakfast: !!venue.meta?.breakfast,
      pets: !!venue.meta?.pets,
    },
    location: {
      address: venue.location?.address ?? "",
      city: venue.location?.city ?? "",
      zip: venue.location?.zip ?? "",
      country: venue.location?.country ?? "",
      continent: venue.location?.continent ?? "",
      lat: venue.location?.lat ?? null,
      lng: venue.location?.lng ?? null,
    },
  });
}

export function VenueForm({
  defaultValues,
  onSubmit,
  submitLabel,
  pendingLabel,
  isSubmitting,
  secondaryAction,
}: VenueFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const resolvedDefaults = useMemo(
    () => resolveVenueDefaults(defaultValues),
    [defaultValues],
  );

  const f = useForm<TVenueCreate>({
    resolver: zodResolver(VenueCreate),
    defaultValues: resolvedDefaults,
    mode: "onBlur",
  });

  useEffect(() => {
    f.reset(resolvedDefaults);
  }, [resolvedDefaults, f]);

  const { fields, append, remove } = useFieldArray({
    control: f.control,
    name: "media",
  });

  const mediaWatch = f.watch("media");

  const handleSubmit = f.handleSubmit(
    async (values) => {
      await onSubmit(sanitizeVenueValues(values));
    },
    (errors) => {
      requestAnimationFrame(() => {
        const first = findFirstErrorName(errors);
        if (first) {
          f.setFocus(first as never, { shouldSelect: true });
          return;
        }
        const el = formRef.current?.querySelector<HTMLElement>(
          '[aria-invalid="true"], [data-invalid="true"] input, [data-invalid="true"] textarea, [data-invalid="true"] select',
        );
        el?.focus();
      });
    },
  );

  const errors = f.formState.errors;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="grid gap-6 md:grid-cols-[1fr_360px]"
      noValidate
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                {...f.register("name")}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              <FieldError id="name-error">{errors.name?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                rows={6}
                {...f.register("description")}
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
              />
              <FieldDescription>
                What makes this venue special?
              </FieldDescription>
              <FieldError id="description-error">
                {errors.description?.message}
              </FieldError>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.price}>
                <FieldLabel htmlFor="price">Price / night</FieldLabel>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step={1}
                  {...f.register("price", { valueAsNumber: true })}
                  aria-invalid={!!errors.price}
                  aria-describedby={errors.price ? "price-error" : undefined}
                />
                <FieldDescription>
                  This is the base price for one night.
                </FieldDescription>
                <FieldError id="price-error">
                  {errors.price?.message}
                </FieldError>
              </Field>

              <Field data-invalid={!!errors.maxGuests}>
                <FieldLabel htmlFor="maxGuests">Max guests</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="maxGuests"
                    type="number"
                    min={1}
                    max={100}
                    {...f.register("maxGuests", { valueAsNumber: true })}
                    aria-invalid={!!errors.maxGuests}
                    aria-describedby={
                      errors.maxGuests ? "maxGuests-error" : undefined
                    }
                  />
                  <InputGroupAddon>
                    <InputGroupButton
                      size="icon-xs"
                      onClick={() =>
                        f.setValue(
                          "maxGuests",
                          Math.max(1, (f.getValues().maxGuests ?? 1) - 1),
                          { shouldDirty: true },
                        )
                      }
                      aria-label="Decrease guests"
                    >
                      –
                    </InputGroupButton>
                    <InputGroupButton
                      size="icon-xs"
                      onClick={() =>
                        f.setValue(
                          "maxGuests",
                          Math.min(100, (f.getValues().maxGuests ?? 1) + 1),
                          { shouldDirty: true },
                        )
                      }
                      aria-label="Increase guests"
                    >
                      +
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  Maximum number of guests allowed.
                </FieldDescription>
                <FieldError id="maxGuests-error">
                  {errors.maxGuests?.message}
                </FieldError>
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground" role="note">
                Add at least one image URL.
              </p>
            )}

            {fields.map((field, idx) => {
              const urlError = errors.media?.[idx]?.url?.message as
                | string
                | undefined;
              const urlId = `media-${idx}-url`;
              const altId = `media-${idx}-alt`;
              const urlValue = mediaWatch?.[idx]?.url ?? "";

              return (
                <div
                  key={field.id}
                  className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <FieldGroup>
                    <Field data-invalid={!!urlError}>
                      <FieldLabel htmlFor={urlId}>Image URL</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id={urlId}
                          placeholder="https://example.com/image.jpg"
                          {...f.register(`media.${idx}.url` as const)}
                          aria-invalid={!!urlError}
                          aria-describedby={
                            urlError ? `${urlId}-error` : undefined
                          }
                        />
                        <InputGroupAddon>
                          <InputGroupButton
                            size="xs"
                            onClick={() => {
                              const current = f.getValues(
                                `media.${idx}.url` as const,
                              );
                              f.setValue(`media.${idx}.url` as const, current, {
                                shouldDirty: true,
                              });
                            }}
                          >
                            Check
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                      <FieldError id={`${urlId}-error`}>{urlError}</FieldError>

                      <div className="overflow-hidden rounded-md border bg-muted grid place-items-center">
                        {urlValue?.trim() ? (
                          <img
                            src={urlValue}
                            alt=""
                            className="object-cover "
                            onError={() =>
                              f.setError(`media.${idx}.url`, {
                                message: "Image failed to load.",
                              })
                            }
                            onLoad={() => {
                              if (
                                f.formState.errors.media?.[idx]?.url
                                  ?.message === "Image failed to load."
                              ) {
                                f.clearErrors(`media.${idx}.url`);
                              }
                            }}
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No URL
                          </span>
                        )}
                      </div>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor={altId}>
                        Alt text (optional)
                      </FieldLabel>
                      <Input
                        id={altId}
                        placeholder="Describe the image"
                        {...f.register(`media.${idx}.alt` as const)}
                      />
                    </Field>
                  </FieldGroup>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remove(idx)}
                  >
                    Remove
                  </Button>
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ url: "", alt: "" })}
            >
              Add image
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <Input id="city" {...f.register("location.city")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Input id="country" {...f.register("location.country")} />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Input id="address" {...f.register("location.address")} />
              </Field>
              <Field>
                <FieldLabel htmlFor="zip">ZIP</FieldLabel>
                <Input id="zip" {...f.register("location.zip")} />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="lat">Latitude</FieldLabel>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  {...f.register("location.lat", { valueAsNumber: true })}
                />
                <FieldDescription>
                  Optional. Use decimal degrees.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="lng">Longitude</FieldLabel>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  {...f.register("location.lng", { valueAsNumber: true })}
                />
              </Field>
            </div>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FieldSet>
              <FieldLegend>Included amenities</FieldLegend>
              <FieldGroup>
                {(
                  [
                    ["wifi", "Wi-Fi"],
                    ["parking", "Parking"],
                    ["pets", "Pets"],
                    ["breakfast", "Breakfast"],
                  ] as const
                ).map(([key, label]) => (
                  <Field key={key} orientation="horizontal">
                    <FieldLabel htmlFor={`amenity-${key}`}>{label}</FieldLabel>
                    <Switch
                      id={`amenity-${key}`}
                      checked={!!f.watch(`meta.${key}`)}
                      onCheckedChange={(value) =>
                        f.setValue(`meta.${key}`, value, { shouldDirty: true })
                      }
                    />
                  </Field>
                ))}
              </FieldGroup>
            </FieldSet>

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (pendingLabel ?? submitLabel) : submitLabel}
              </Button>
              {secondaryAction}
            </div>
          </CardContent>
        </Card>
      </aside>
    </form>
  );
}

export { resolveVenueDefaults as getVenueFormDefaults, sanitizeVenueValues };
