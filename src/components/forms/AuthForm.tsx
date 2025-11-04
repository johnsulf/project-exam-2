import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getErrorMessage } from "@/helpers/errorMessageHelper";
import { cn } from "@/lib/utils";

type BaseProps<T> = {
  className?: string;
  defaultValues?: Partial<T>;
  description?: string;
  loading?: boolean;
  serverError?: string | null;
  submitLabel?: string;
  onSuccess?: (values: T) => void;
};

const NOROFF_DOMAIN_MESSAGE = "Use your stud.noroff.no email";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters"),
  email: z
    .string()
    .email("Enter a valid email")
    .refine((e) => /@stud\.noroff\.no$/i.test(e), NOROFF_DOMAIN_MESSAGE),
  password: z.string().min(6, "Password must be at least 6 characters"),
  venueManager: z.boolean().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

type LoginProps = BaseProps<LoginFormValues> & {
  mode: "login";
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
};

type RegisterProps = BaseProps<RegisterFormValues> & {
  mode: "register";
  onSubmit: (values: RegisterFormValues) => Promise<void> | void;
  lockVenueManager?: boolean;
  showVenueManagerToggle?: boolean;
  venueManagerLabel?: string;
};

export type AuthFormProps = LoginProps | RegisterProps;

export function AuthForm(props: AuthFormProps) {
  const schema = props.mode === "login" ? loginSchema : registerSchema;
  const lockVenueManager =
    props.mode === "register" ? (props.lockVenueManager ?? false) : false;

  const baseDefaults = useMemo(() => {
    if (props.mode === "login") {
      return { email: "", password: "" } satisfies LoginFormValues;
    }
    return {
      name: "",
      email: "",
      password: "",
      venueManager: lockVenueManager,
    } satisfies RegisterFormValues;
  }, [props.mode, lockVenueManager]);

  const defaults = useMemo(
    () => ({ ...baseDefaults, ...(props.defaultValues ?? {}) }),
    [baseDefaults, props.defaultValues],
  );

  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    mode: "onSubmit",
  });
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  // Narrow error types to avoid union property access issues
  const loginErrors =
    props.mode === "login"
      ? (errors as import("react-hook-form").FieldErrors<LoginFormValues>)
      : null;
  const registerErrors =
    props.mode === "register"
      ? (errors as import("react-hook-form").FieldErrors<RegisterFormValues>)
      : null;

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const busy = props.loading || isSubmitting;
  const errorMessage = submitError ?? props.serverError ?? null;
  const emailHelpId = props.mode === "register" ? "auth-email-help" : null;
  const emailErrorId = errors.email ? "auth-email-error" : null;
  const emailDescribedBy = [emailHelpId, emailErrorId]
    .filter(Boolean)
    .join(" ");
  const emailAriaDescribedBy = emailDescribedBy.length
    ? emailDescribedBy
    : undefined;
  const showManagerSection =
    props.mode === "register" &&
    ((props.showVenueManagerToggle ?? true) || lockVenueManager);

  async function handle(values: LoginFormValues | RegisterFormValues) {
    try {
      setSubmitError(null);
      if (props.mode === "login") {
        const loginValues = values as LoginFormValues;
        await props.onSubmit(loginValues);
        props.onSuccess?.(loginValues);
      } else {
        const registerValues = {
          ...(values as RegisterFormValues),
          venueManager: lockVenueManager
            ? true
            : (values as RegisterFormValues).venueManager,
        } satisfies RegisterFormValues;
        await props.onSubmit(registerValues);
        props.onSuccess?.(registerValues);
      }
    } catch (err: unknown) {
      setSubmitError(getErrorMessage(err));
      throw err;
    }
  }

  return (
    <form
      className={cn("space-y-4", props.className)}
      noValidate
      onSubmit={handleSubmit(handle)}
      aria-busy={busy ? "true" : "false"}
    >
      <div className="sr-only" role="status" aria-live="polite">
        {busy ? "Submitting…" : "Idle"}
      </div>

      {props.description ? (
        <p className="text-sm text-muted-foreground">{props.description}</p>
      ) : null}

      {props.mode === "register" ? (
        <div className="space-y-1.5">
          <Label htmlFor="auth-name">Name</Label>
          <Input
            id="auth-name"
            autoComplete="name"
            aria-invalid={registerErrors?.name ? "true" : "false"}
            aria-describedby={
              registerErrors?.name ? "auth-name-error" : undefined
            }
            {...register("name" as const)}
          />
          {registerErrors?.name ? (
            <p
              id="auth-name-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {registerErrors.name.message as string}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="auth-email">Email</Label>
        <Input
          id="auth-email"
          type="email"
          autoComplete="email"
          placeholder={props.mode === "register" ? "you@stud.noroff.no" : ""}
          aria-invalid={
            (registerErrors ?? loginErrors)?.email ? "true" : "false"
          }
          aria-describedby={emailAriaDescribedBy}
          {...register("email" as const)}
        />
        {props.mode === "register" ? (
          <p id="auth-email-help" className="text-sm text-muted-foreground">
            Must use your stud.noroff.no email address.
          </p>
        ) : null}
        {errors.email ? (
          <p
            id="auth-email-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.email.message as string}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="auth-password">Password</Label>
        <Input
          id="auth-password"
          type="password"
          autoComplete={
            props.mode === "login" ? "current-password" : "new-password"
          }
          aria-invalid={
            (registerErrors ?? loginErrors)?.password ? "true" : "false"
          }
          aria-describedby={
            (registerErrors ?? loginErrors)?.password
              ? "auth-password-error"
              : undefined
          }
          {...register("password" as const)}
        />
        {errors.password ? (
          <p
            id="auth-password-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.password.message as string}
          </p>
        ) : null}
      </div>

      {showManagerSection ? (
        <Controller
          name="venueManager"
          control={control}
          render={({ field }) => {
            const checkboxId = "auth-venueManager";
            const value = lockVenueManager ? true : (field.value ?? false);
            const venueManagerError = registerErrors?.venueManager;
            return (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={checkboxId}
                  checked={value}
                  onCheckedChange={(checked) =>
                    field.onChange(Boolean(checked))
                  }
                  onBlur={field.onBlur}
                  aria-labelledby="auth-venueManager-label"
                  aria-invalid={venueManagerError ? "true" : "false"}
                  disabled={lockVenueManager}
                />
                <Label id="auth-venueManager-label" htmlFor={checkboxId}>
                  {props.venueManagerLabel ?? "Register as venue manager"}
                </Label>
              </div>
            );
          }}
        />
      ) : null}

      {errorMessage ? (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {errorMessage}
        </div>
      ) : null}

      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Please wait…" : (props.submitLabel ?? "Continue")}
      </Button>
    </form>
  );
}
