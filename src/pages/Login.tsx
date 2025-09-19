import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { AuthDialog } from "@/features/auth/AuthDialog";
import { useAuth } from "@/features/auth/store";
import { resolveDestination } from "@/features/auth/returnTo";

type LocationState = {
  from?:
    | Location
    | { pathname?: string; search?: string; hash?: string }
    | string;
};

export default function Login() {
  const [open, setOpen] = useState(true);
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const from = useMemo(
    () => (location.state as LocationState | undefined)?.from,
    [location.state],
  );

  const destination = useMemo(() => resolveDestination(from) ?? "/", [from]);

  useEffect(() => {
    if (token) {
      navigate(destination, { replace: true });
    }
  }, [token, destination, navigate]);

  useEffect(() => {
    if (!open) {
      if (token) {
        navigate(destination, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [open, token, destination, navigate]);

  return <AuthDialog open={open} onOpenChange={setOpen} />;
}
