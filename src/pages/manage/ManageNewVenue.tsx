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
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...f.register("name")} />
                {f.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {f.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={6}
                  {...f.register("description")}
                />
                {f.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {f.formState.errors.description.message}
                  </p>
                )}
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
                  {f.formState.errors.price && (
                    <p className="text-sm text-destructive">
                      {f.formState.errors.price.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="maxGuests">Max guests</Label>
                  <Input
                    id="maxGuests"
                    type="number"
                    min={1}
                    max={100}
                    {...f.register("maxGuests", { valueAsNumber: true })}
                  />
                  {f.formState.errors.maxGuests && (
                    <p className="text-sm text-destructive">
                      {f.formState.errors.maxGuests.message}
                    </p>
                  )}
                </div>
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
              {fields.map((field, idx) => (
                <div key={field.id} className="grid grid-cols-[1fr_auto] gap-2">
                  <div className="space-y-2">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...f.register(`media.${idx}.url` as const)}
                    />
                    <Input
                      placeholder="Alt text (optional)"
                      {...f.register(`media.${idx}.alt` as const)}
                    />
                    {f.formState.errors.media?.[idx]?.url && (
                      <p className="text-sm text-destructive">
                        {
                          f.formState.errors.media?.[idx]?.url
                            ?.message as string
                        }
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remove(idx)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
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
              <div className="flex items-center justify-between">
                <Label htmlFor="wifi" className="cursor-pointer">
                  WiFi
                </Label>
                <Switch
                  id="wifi"
                  checked={!!f.watch("meta.wifi")}
                  onCheckedChange={(v) => f.setValue("meta.wifi", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="parking" className="cursor-pointer">
                  Parking
                </Label>
                <Switch
                  id="parking"
                  checked={!!f.watch("meta.parking")}
                  onCheckedChange={(v) => f.setValue("meta.parking", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pets" className="cursor-pointer">
                  Pets
                </Label>
                <Switch
                  id="pets"
                  checked={!!f.watch("meta.pets")}
                  onCheckedChange={(v) => f.setValue("meta.pets", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="breakfast" className="cursor-pointer">
                  Breakfast
                </Label>
                <Switch
                  id="breakfast"
                  checked={!!f.watch("meta.breakfast")}
                  onCheckedChange={(v) => f.setValue("meta.breakfast", v)}
                />
              </div>
              <Separator />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating…" : "Create venue"}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </form>
    </div>
  );
}
