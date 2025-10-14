import { Navigate, Outlet, useLocation, type Location } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "./store";

const managerAccessNotified = { current: false };

export function RequireManager() {
  const { token, profile, loading } = useAuth();
  const loc = useLocation();

  // 1) Not signed in? Go to login and come back after.
  if (!token) {
    const from =
      (loc.state as { from?: Location | string } | null | undefined)?.from ??
      loc;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  // 2) While the store is figuring itself out (e.g., after refresh)
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
    return <Navigate to="/profile" replace />;
  }

  // 4) Authorized
  return <Outlet />;
}

export function __resetManagerAccessNotice() {
  managerAccessNotified.current = false;
}
