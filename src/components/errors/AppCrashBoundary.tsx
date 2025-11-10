import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function CrashFallback({ error, resetErrorBoundary }: FallbackProps) {
  const navigate = useNavigate();

  async function copy() {
    try {
      await navigator.clipboard.writeText(
        `${error.name}: ${error.message}\n${error.stack ?? ""}`,
      );
      toast.success("Error details copied");
    } catch {
      toast.error("Could not copy error details");
    }
  }

  return (
    <div className="mx-auto max-w-[720px] py-16 px-5 text-center space-y-4">
      <h1 className="text-2xl font-semibold">Something broke</h1>
      <p className="text-muted-foreground">
        We hit an unexpected error while rendering.
      </p>
      <pre className="mx-auto max-w-full overflow-auto rounded-lg bg-muted p-3 text-left text-xs">
        {error.message}
      </pre>
      <div className="flex justify-center gap-2">
        <Button variant="secondary" onClick={resetErrorBoundary}>
          Try again
        </Button>
        <Button onClick={() => navigate("/")}>Go home</Button>
        <Button variant="outline" onClick={copy}>
          Copy details
        </Button>
      </div>
    </div>
  );
}

export function AppCrashBoundary({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary FallbackComponent={CrashFallback} resetKeys={[pathname]}>
      {children}
    </ErrorBoundary>
  );
}
