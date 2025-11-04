import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./store";
import { routes } from "@/router/routes";

export function RequireAuth() {
  const { token } = useAuth();
  const loc = useLocation();
  return token ? (
    <Outlet />
  ) : (
    <Navigate to={routes.auth.login} replace state={{ from: loc }} />
  );
}
