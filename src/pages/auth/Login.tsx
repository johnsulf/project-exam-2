import { useEffect, useMemo } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  type Location,
} from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthForm, type LoginFormValues } from "@/components/forms/AuthForm";
import { useAuth } from "@/features/auth/store";
import { resolveDestination } from "@/features/auth/returnTo";
import { getErrorMessage } from "@/helpers/errorMessageHelper";
import { routes } from "@/router/routes";
import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";

type LocationState = {
  from?:
    | Location
    | { pathname?: string; search?: string; hash?: string }
    | string;
};

export default function Login() {
  const { signIn, loading, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const from = useMemo(
    () => (location.state as LocationState | undefined)?.from,
    [location.state],
  );

  const destination = useMemo(
    () => resolveDestination(from) ?? routes.home,
    [from],
  );

  useEffect(() => {
    if (token) {
      navigate(destination, { replace: true });
    }
  }, [token, destination, navigate]);

  async function handleLogin(values: LoginFormValues) {
    try {
      await signIn(values.email, values.password);
      toast.success("Logged in");
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  }

  const breadcrumbs = [
    { label: "Home", to: routes.home },
    { label: "Sign in" },
  ];

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-10 animate-fade-in-up">
      <PageBreadcrumbs items={breadcrumbs} />
      <Card>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Sign in to manage bookings, keep track of your trips, and discover
            new venues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AuthForm
            mode="login"
            submitLabel="Sign in"
            loading={loading}
            onSubmit={handleLogin}
          />
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link className="text-primary underline" to={routes.auth.register}>
              Register now
            </Link>
            .
          </p>
          <p className="text-sm text-muted-foreground">
            Ready to manage venues?{" "}
            <Link
              className="text-primary underline"
              to={routes.auth.registerManager}
            >
              Register as a venue manager
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
