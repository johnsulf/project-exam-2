import { useParams, useNavigate, Link } from "react-router-dom";
import { useVenue } from "@/features/venues/hooks";
import { type TVenueCreate } from "@/types/schemas";
import { useUpdateVenue } from "@/features/manager/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VenueForm, venueToFormValues } from "@/components/forms/VenueForm";

export default function ManageEditVenue() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: venue, isLoading, isError } = useVenue(id);
  const { mutateAsync, isPending } = useUpdateVenue(id!);

  async function onSubmit(values: TVenueCreate) {
    await mutateAsync(values);
    navigate(`/manage/${id}`, { replace: true });
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  }

  if (isError || !venue) {
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

      <VenueForm
        defaultValues={venueToFormValues(venue)}
        onSubmit={onSubmit}
        submitLabel="Save changes"
        pendingLabel="Saving…"
        isSubmitting={isPending}
      />
    </div>
  );
}
