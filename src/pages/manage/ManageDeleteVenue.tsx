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
import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";
import { Spinner } from "@/components/ui/spinner";

export default function ManageDeleteVenue() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: venue, isLoading, isError } = useVenue(id);
  const { mutateAsync, isPending } = useDeleteVenue(id!);

  const baseBreadcrumbs = [
    { label: "Home", to: "/" },
    { label: "Manage", to: "/manage" },
    { label: "Delete venue" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-3">
        <PageBreadcrumbs items={baseBreadcrumbs} />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }
  if (isError || !venue) {
    return (
      <div className="space-y-3">
        <PageBreadcrumbs items={baseBreadcrumbs} />
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
      <PageBreadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Manage", to: "/manage" },
          { label: venue.name, to: `/manage/${id ?? ""}` },
          { label: "Delete" },
        ]}
      />
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
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending && <Spinner className="mr-2" aria-hidden="true" />}
            {isPending ? "Deleting…" : "Delete"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
