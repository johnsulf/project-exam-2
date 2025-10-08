import { useNavigate, Link } from "react-router-dom";
import { type TVenueCreate } from "@/types/schemas";
import { useCreateVenue } from "@/features/manager/hooks";
import { Button } from "@/components/ui/button";
import { VenueForm } from "@/features/manager/VenueForm";

export default function ManageNewVenue() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateVenue();

  async function onSubmit(values: TVenueCreate) {
    const created = await mutateAsync(values);
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

      <VenueForm
        onSubmit={onSubmit}
        submitLabel="Create venue"
        pendingLabel="Creating…"
        isSubmitting={isPending}
      />
    </div>
  );
}
