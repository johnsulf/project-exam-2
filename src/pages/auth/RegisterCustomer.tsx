import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthForm, type RegisterFormValues } from "@/components/forms/AuthForm";
import { useAuth } from "@/features/auth/store";
import { getErrorMessage } from "@/helpers/errorMessageHelper";
import { routes } from "@/router/routes";
import { PageBreadcrumbs } from "@/components/layout/PageBreadcrumbs";

export default function RegisterCustomer() {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuth();

  async function handleRegister(values: RegisterFormValues) {
    try {
      await registerUser({ ...values, venueManager: false });
      toast.success("Account created - welcome to Holidaze!");
      navigate(routes.home, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  }

  const breadcrumbs = [
    { label: "Home", to: routes.home },
    { label: "Create account" },
  ];

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-10 animate-fade-in-up">
      <PageBreadcrumbs items={breadcrumbs} />
      <Card>
        <CardHeader>
          <CardTitle>Create your Holidaze account</CardTitle>
          <CardDescription>
            Sign up with your stud.noroff.no email to book venues and manage
            your trips.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AuthForm
            mode="register"
            submitLabel="Create customer account"
            loading={loading}
            showVenueManagerToggle={false}
            defaultValues={{ venueManager: false }}
            onSubmit={handleRegister}
          />
          <p className="text-muted-foreground">
            Ready to manage venues?{" "}
            <Link
              className="text-primary underline"
              to={routes.auth.registerManager}
            >
              Register as a venue manager
            </Link>
            .
          </p>
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link className="text-primary underline" to={routes.auth.login}>
              Sign in
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
