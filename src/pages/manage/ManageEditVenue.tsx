import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useVenue } from "@/features/venues/hooks";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VenueCreate, type TVenueCreate } from "@/types/schemas";
import { useUpdateVenue } from "@/features/manager/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManageEditVenue() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: v, isLoading, isError } = useVenue(id);
  const { mutateAsync, isPending } = useUpdateVenue(id!);

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

  // media array helpers
  const { fields, append, remove } = useFieldArray({
    control: f.control,
    name: "media",
  });

  // Prefill when venue loads
  useEffect(() => {
    if (!v) return;
    f.reset({
      name: v.name,
      description: v.description,
      media: (v.media ?? []).map((m) => ({ url: m.url, alt: m.alt ?? "" })),
      price: v.price,
      maxGuests: v.maxGuests,
      rating: typeof v.rating === "number" ? v.rating : 0,
      meta: {
        wifi: !!v.meta?.wifi,
        parking: !!v.meta?.parking,
        breakfast: !!v.meta?.breakfast,
        pets: !!v.meta?.pets,
      },
      location: {
        address: v.location?.address ?? "",
        city: v.location?.city ?? "",
        zip: v.location?.zip ?? "",
        country: v.location?.country ?? "",
        continent: v.location?.continent ?? "",
        lat: v.location?.lat ?? null,
        lng: v.location?.lng ?? null,
      },
    });
  }, [v, f]);

  async function onSubmit(values: TVenueCreate) {
    const patch = {
      ...values,
      media: (values.media ?? []).filter((m) => m.url?.trim()),
      location:
        values.location &&
        Object.values(values.location).every(
          (val) => val === "" || val === null || val === undefined,
        )
          ? undefined
          : values.location,
    };
    await mutateAsync(patch);
    navigate(`/venues/${id}`, { replace: true });
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  }
  if (isError || !v) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Edit venue</h1>
        <p className="text-destructive">Couldn’t load venue.</p>
        <Button asChild variant="outline">
          <Link to="/manage">Back to Manage</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit venue</h1>
        <Button variant="outline" asChild>
          <Link to="/manage">Cancel</Link>
        </Button>
      </header>

      <form
        onSubmit={f.handleSubmit(onSubmit)}
        className="grid gap-6 md:grid-cols-[1fr_360px]"
      >
        {/* Left column (same structure as Create) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...f.register("name")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={6}
                  {...f.register("description")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price / night</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    step="1"
                    {...f.register("price", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="maxGuests">Max guests</Label>
                  <div className="flex gap-2">
                    <Input
                      id="maxGuests"
                      type="number"
                      min={1}
                      max={100}
                      {...f.register("maxGuests", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, idx) => {
                const url = mediaWatch?.[idx]?.url?.trim();
                const urlId = `media-${idx}-url`;
                const altId = `media-${idx}-alt`;
                const errMsg = f.formState.errors.media?.[idx]?.url?.message as
                  | string
                  | undefined;

                return (
                  <div
                    key={field.id}
                    className="grid grid-cols-[1fr_auto] gap-2"
                  >
                    <div className="space-y-2">
                      <div className="grid grid-cols-[1fr_96px] gap-2">
                        <div className="space-y-1.5">
                          <Label htmlFor={urlId}>Image URL</Label>
                          <Input
                            id={urlId}
                            placeholder="https://example.com/image.jpg"
                            aria-invalid={!!errMsg}
                            aria-describedby={
                              errMsg ? `${urlId}-error` : undefined
                            }
                            {...f.register(`media.${idx}.url` as const)}
                          />
                          {errMsg && (
                            <p
                              id={`${urlId}-error`}
                              role="alert"
                              className="text-sm text-destructive"
                            >
                              {errMsg}
                            </p>
                          )}
                        </div>

                        {/* Tiny live preview box */}
                        <div className="rounded-md border overflow-hidden grid place-items-center bg-muted">
                          {url ? (
                            <img
                              src={url}
                              alt=""
                              className="h-24 w-24 object-cover"
                              onError={() => {
                                // mark invalid if it fails to load (optional)
                                if (!f.formState.errors.media?.[idx]?.url)
                                  f.setError(`media.${idx}.url`, {
                                    message: "Image failed to load.",
                                  });
                              }}
                              onLoad={() => {
                                // clear "failed" error if it becomes valid
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
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor={altId}>Alt text (optional)</Label>
                        <Input
                          id={altId}
                          placeholder="Describe the image"
                          {...f.register(`media.${idx}.alt` as const)}
                        />
                      </div>
                    </div>

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
                <div className="space-y-1.5">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    {...f.register("location.lat", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    {...f.register("location.lng", { valueAsNumber: true })}
                  />
                </div>
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
              <fieldset>
                <legend className="text-sm font-medium mb-2">
                  Included amenities
                </legend>

                {(
                  [
                    ["wifi", "WiFi"],
                    ["parking", "Parking"],
                    ["pets", "Pets"],
                    ["breakfast", "Breakfast"],
                  ] as const
                ).map(([key, label]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between my-1"
                  >
                    <Label
                      htmlFor={`amenity-${key}`}
                      className="cursor-pointer"
                    >
                      {label}
                    </Label>
                    <Switch
                      id={`amenity-${key}`}
                      checked={!!f.watch(`meta.${key}`)}
                      onCheckedChange={(v) =>
                        f.setValue(`meta.${key}`, v, { shouldDirty: true })
                      }
                      aria-labelledby={`amenity-${key}-label`}
                    />
                  </div>
                ))}
              </fieldset>

              <Separator />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Saving…" : "Save"}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </form>
    </div>
  );
}
