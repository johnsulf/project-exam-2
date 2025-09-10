import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { getErrorMessage } from "@/helpers/errorMessageHelper";

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Min 2 characters"),
  email: z
    .string()
    .email("Enter a valid email")
    .refine(
      (e) => /@stud\.noroff\.no$/i.test(e),
      "Use your stud.noroff.no email",
    ),
  password: z.string().min(6, "Min 6 characters"),
  venueManager: z.boolean().default(false),
});

export function AuthDialog({ open, onOpenChange }: Props) {
  const { signIn, register: registerUser, loading } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");

  // LOGIN
  const lf = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onLogin(values: z.infer<typeof loginSchema>) {
    try {
      await signIn(values.email, values.password);
      toast.success("Logged in");
      onOpenChange(false);
    } catch (e: unknown) {
      toast.error(getErrorMessage(e));
    }
  }

  // REGISTER
  const rf = useForm<z.input<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", venueManager: false },
  });

  async function onRegister(values: z.input<typeof registerSchema>) {
    try {
      const parsed = registerSchema.parse(values);
      await registerUser(parsed);
      toast.success("Account created. Please log in.");
      setTab("login");
      lf.setValue("email", parsed.email);
      lf.setFocus("password");
    } catch (e: unknown) {
      toast.error(getErrorMessage(e));
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
            <form className="space-y-3" onSubmit={lf.handleSubmit(onLogin)}>
              <div className="space-y-1.5">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  {...lf.register("email")}
                />
                {lf.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {lf.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  {...lf.register("password")}
                />
                {lf.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {lf.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || lf.formState.isSubmitting}
              >
                {loading || lf.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Sign in
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <form className="space-y-3" onSubmit={rf.handleSubmit(onRegister)}>
              <div className="space-y-1.5">
                <Label htmlFor="reg-name">Name</Label>
                <Input id="reg-name" {...rf.register("name")} />
                {rf.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {rf.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-email">Student email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="you@stud.noroff.no"
                  {...rf.register("email")}
                />
                {rf.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {rf.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-password">Password</Label>
                <Input
                  id="reg-password"
                  type="password"
                  {...rf.register("password")}
                />
                {rf.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {rf.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="venueManager" {...rf.register("venueManager")} />
                <Label htmlFor="venueManager">Register as venue manager</Label>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading || rf.formState.isSubmitting}
              >
                {loading || rf.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Create account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
