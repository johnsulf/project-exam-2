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

export default function RegisterManager() {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuth();

  async function handleRegister(values: RegisterFormValues) {
    try {
      await registerUser({ ...values, venueManager: true });
      toast.success("Manager account created. Please log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Register as a venue manager</CardTitle>
          <CardDescription>
            Use your stud.noroff.no email to list and manage venues on Holidaze.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <AuthForm
            mode="register"
            submitLabel="Create manager account"
            loading={loading}
            showVenueManagerToggle={false}
            lockVenueManager
            defaultValues={{ venueManager: true }}
            onSubmit={handleRegister}
          />
          <p className="text-sm text-muted-foreground">
            Looking for a guest account?{" "}
            <Link className="text-primary underline" to="/auth/register">
              Register as a customer
            </Link>
            .
          </p>
          <p className="text-sm text-muted-foreground">
            Already manage a venue?{" "}
            <Link className="text-primary underline" to="/login">
              Sign in
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
