import { Navigate, Outlet, useLocation, type Location } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "./store";
import { routes } from "@/router/routes";

const managerAccessNotified = { current: false };

export function RequireManager() {
  const { token, profile, loading } = useAuth();
  const loc = useLocation();

  if (!token) {
    const from =
      (loc.state as { from?: Location | string } | null | undefined)?.from ??
      loc;
    return <Navigate to={routes.auth.login} replace state={{ from }} />;
  }
  if (loading) {
    return (
      <div className="sr-only" role="status" aria-live="polite">
        Loading…
      </div>
    );
  }
  if (!profile?.venueManager) {
    if (!managerAccessNotified.current) {
      toast.error("Manager access required");
      managerAccessNotified.current = true;
    }
    return <Navigate to={routes.profile} replace />;
  }

  return <Outlet />;
}

export function __resetManagerAccessNotice() {
  managerAccessNotified.current = false;
}
