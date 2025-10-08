import { useNavigate, useParams, Link } from "react-router-dom";
import { useVenue } from "@/features/venues/hooks";
import { useDeleteVenue } from "@/features/manager/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManageDeleteVenue() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: venue, isLoading, isError } = useVenue(id);
  const { mutateAsync, isPending } = useDeleteVenue(id!);

  if (isLoading) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }
  if (isError || !venue) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Delete venue</h1>
        <p className="text-destructive">Couldn’t load venue.</p>
        <Button asChild variant="outline">
          <Link to="/manage">Back to Manage</Link>
        </Button>
      </div>
    );
  }

  async function onDelete() {
    await mutateAsync();
    navigate("/manage", { replace: true });
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Delete venue</h1>
      <Card>
        <CardHeader>
          <CardTitle>Are you sure?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            You’re about to permanently delete{" "}
            <span className="font-medium">{venue.name}</span>. This action
            cannot be undone.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link to="/manage">Cancel</Link>
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={isPending}>
            {isPending ? "Deleting…" : "Delete"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
