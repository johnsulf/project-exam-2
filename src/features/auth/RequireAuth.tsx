import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./store";

export function RequireAuth() {
  const { token } = useAuth();
  const loc = useLocation();
  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: loc }} />
  );
}
