import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { useAuth } from "@/features/auth/store";
import { router } from "@/router/router";
import { getErrorMessage } from "@/helpers/errorMessageHelper";
import { routes } from "@/router/routes";

export function AuthProvider({ children }: PropsWithChildren) {
  const { token, refreshProfile, signOut, loading, error } = useAuth();
  const [statusError, setStatusError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(() => Boolean(token));

  useEffect(() => {
    if (error && token) {
      setStatusError(error);
    }
  }, [error, token]);

  useEffect(() => {
    let cancelled = false;

    if (!token) {
      setInitializing(false);
      return () => {
        cancelled = true;
      };
    }

    setInitializing(true);

    (async () => {
      try {
        await refreshProfile();
        if (!cancelled) {
          setStatusError(null);
        }
      } catch (err) {
        if (cancelled) return;
        const message = getErrorMessage(err);
        setStatusError(message);
        signOut();
        router.navigate(routes.auth.login);
      } finally {
        if (!cancelled) {
          setInitializing(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, refreshProfile, signOut]);

  const busy = useMemo(() => initializing || loading, [initializing, loading]);

  return (
    <>
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        data-testid="auth-status"
      >
        {busy ? "Checking your session…" : "Session ready"}
      </div>
      {statusError ? (
        <div
          role="alert"
          aria-live="assertive"
          className="border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive"
          data-testid="auth-error"
        >
          {statusError}
        </div>
      ) : null}
      {children}
    </>
  );
}
