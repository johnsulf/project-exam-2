import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Something went wrong";
  let description = "An error occurred while loading this page.";
  let status: number | undefined;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    title = `${error.status} ${error.statusText}`;
    const data = error.data as { message?: string };
    description = data?.message || description;
  } else if (error instanceof Error) {
    description = error.message;
  } else if (typeof error === "string") {
    description = error;
  }

  return (
    <div className="mx-auto max-w-[720px] py-16 px-5 text-center space-y-4">
      <h1>{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      {status && (
        <p className="text-xs text-muted-foreground/70">Status: {status}</p>
      )}
      <div className="flex justify-center gap-2 pt-2">
        <Button variant="secondary" onClick={() => navigate(0)}>
          Retry
        </Button>
        <Button onClick={() => navigate("/")}>Go home</Button>
      </div>
    </div>
  );
}
