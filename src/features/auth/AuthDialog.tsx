import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AuthForm,
  type LoginFormValues,
  type RegisterFormValues,
} from "@/components/forms/AuthForm";
import { getErrorMessage } from "@/helpers/errorMessageHelper";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export function AuthDialog({ open, onOpenChange }: Props) {
  const { signIn, register: registerUser, loading } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");

  const [loginDefaults, setLoginDefaults] = useState<LoginFormValues>({
    email: "",
    password: "",
  });

  async function onLogin(values: LoginFormValues) {
    try {
      await signIn(values.email, values.password);
      toast.success("Logged in");
      onOpenChange(false);
    } catch (e: unknown) {
      toast.error(getErrorMessage(e));
      throw e;
    }
  }

  async function onRegister(values: RegisterFormValues) {
    try {
      await registerUser(values);
      toast.success("Account created. Please log in.");
      setLoginDefaults((prev) => ({ ...prev, email: values.email }));
      setTab("login");
    } catch (e: unknown) {
      toast.error(getErrorMessage(e));
      throw e;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {tab === "login" ? "Welcome back" : "Create account"}
          </DialogTitle>
          <DialogDescription>
            {tab === "login"
              ? "Sign in to manage bookings and venues."
              : "Use your stud.noroff.no email to register."}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "login" | "register")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <AuthForm
              mode="login"
              submitLabel="Sign in"
              loading={loading}
              defaultValues={loginDefaults}
              onSubmit={onLogin}
            />
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <AuthForm
              mode="register"
              submitLabel="Create account"
              loading={loading}
              onSubmit={onRegister}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
