import { Navigate, Outlet, useLocation, type Location } from "react-router-dom";
import { useAuth } from "./store";

export function RequireAuth() {
  const { token } = useAuth();
  const loc = useLocation();
  if (!token) {
    const from =
      (loc.state as { from?: Location | string } | null | undefined)?.from ??
      loc;
    return <Navigate to="/login" replace state={{ from }} />;
  }
  return <Outlet />;
}
