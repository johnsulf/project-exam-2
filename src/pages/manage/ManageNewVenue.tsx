import { useNavigate, Link } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VenueCreate, type TVenueCreate } from "@/types/schemas";
import { useCreateVenue } from "@/features/manager/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldSet,
  FieldLegend,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

export default function ManageNewVenue() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateVenue();

  const f = useForm<typeof VenueCreate>({
    resolver: zodResolver(VenueCreate),
    defaultValues: {
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
    },
    mode: "onBlur",
  });

  const mediaWatch = f.watch("media");

  const { fields, append, remove } = useFieldArray({
    control: f.control,
    name: "media",
  });

  async function onSubmit(values: TVenueCreate) {
    const cleaned: TVenueCreate = {
      ...values,
      media: (values.media ?? []).filter((m) => m.url?.trim()),
      location:
        values.location &&
        Object.values(values.location).every(
          (v) => v === "" || v === null || v === undefined,
        )
          ? undefined
          : values.location,
      meta: values.meta,
    };

    const created = await mutateAsync(cleaned);
    const id =
      (created as { id?: string }).id ??
      (created as { data?: { id?: string } }).data?.id;

    navigate(id ? `/venues/${id}` : "/manage", { replace: true });
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create venue</h1>
        <Button variant="outline" asChild>
          <Link to="/manage">Cancel</Link>
        </Button>
      </header>

      <form
        onSubmit={f.handleSubmit(onSubmit)}
        className="grid gap-6 md:grid-cols-[1fr_360px]"
      >
        {/* Left column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field data-invalid={!!f.formState.errors.name}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  {...f.register("name")}
                  aria-invalid={!!f.formState.errors.name}
                />
                <FieldError>{f.formState.errors.name?.message}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  rows={6}
                  {...f.register("description")}
                />
                <FieldDescription>
                  What makes this venue special?
                </FieldDescription>
                <FieldError>
                  {f.formState.errors.description?.message}
                </FieldError>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Price / night</FieldLabel>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    step="1"
                    {...f.register("price", { valueAsNumber: true })}
                  />
                  <FieldDescription>
                    This is the base price for one night.
                  </FieldDescription>
                  <FieldError>{f.formState.errors.price?.message}</FieldError>
                </Field>
                <Field data-invalid={!!f.formState.errors.maxGuests}>
                  <FieldLabel htmlFor="maxGuests">Max guests</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="maxGuests"
                      type="number"
                      min={1}
                      max={100}
                      {...f.register("maxGuests", { valueAsNumber: true })}
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
                  <FieldError>
                    {f.formState.errors.maxGuests?.message}
                  </FieldError>
                  <FieldDescription>
                    Maximum number of guests allowed.
                  </FieldDescription>
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
                <p className="text-sm text-muted-foreground">
                  Add at least one image URL.
                </p>
              )}
              {fields.map((field, idx) => {
                return (
                  <div
                    key={field.id}
                    className="grid grid-cols-[1fr_auto] gap-2"
                  >
                    <FieldGroup>
                      <Field data-invalid={!!err}>
                        <FieldLabel htmlFor={urlId}>Image URL</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={urlId}
                            placeholder="image.jpg"
                            {...f.register(`media.${idx}.url` as const)}
                            aria-invalid={!!err}
                          />
                          <InputGroupAddon>
                            <InputGroupText>https://</InputGroupText>
                            <InputGroupButton
                              size="xs"
                              onClick={() => {
                                // Trigger a simple load check by toggling the same value to run your <img> onLoad/onError
                                const v = f.getValues(
                                  `media.${idx}.url` as const,
                                );
                                f.setValue(`media.${idx}.url` as const, v, {
                                  shouldDirty: true,
                                });
                              }}
                            >
                              Check
                            </InputGroupButton>
                          </InputGroupAddon>
                        </InputGroup>
                        <FieldError>{err}</FieldError>

                        {/* your tiny preview stays exactly as you had it */}
                        <div className="mt-2 rounded-md border overflow-hidden grid place-items-center bg-muted h-24 w-24">
                          {mediaWatch?.[idx]?.url?.trim() ? (
                            <img
                              src={mediaWatch[idx]!.url!}
                              alt=""
                              className="h-24 w-24 object-cover"
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
                            <span className="text-xs text-muted-foreground p-1 text-center">
                              No URL
                            </span>
                          )}
                        </div>
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
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...f.register("location.city")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...f.register("location.country")} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" {...f.register("location.address")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="zip">ZIP</Label>
                  <Input id="zip" {...f.register("location.zip")} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
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

        {/* Right column */}
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
                      <FieldLabel htmlFor={`amenity-${key}`}>
                        {label}
                      </FieldLabel>
                      <Switch
                        id={`amenity-${key}`}
                        checked={!!f.watch(`meta.${key}`)}
                        onCheckedChange={(v) =>
                          f.setValue(`meta.${key}`, v, { shouldDirty: true })
                        }
                      />
                    </Field>
                  ))}
                </FieldGroup>
              </FieldSet>

              <Separator />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating..." : "Create Venue"}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </form>
    </div>
  );
}
