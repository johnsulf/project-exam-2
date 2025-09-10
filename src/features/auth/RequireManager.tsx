import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./store";

export function RequireManager() {
  const { profile } = useAuth();
  if (!profile?.venueManager) {
    return <Navigate to="/profile" replace />;
  }
  return <Outlet />;
}
