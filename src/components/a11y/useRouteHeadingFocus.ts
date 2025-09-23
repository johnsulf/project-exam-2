import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function useRouteHeadingFocus<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const id = window.setTimeout(() => {
      ref.current?.focus();
    }, 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return ref;
}
