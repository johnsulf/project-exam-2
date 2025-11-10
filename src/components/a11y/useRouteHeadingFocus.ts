import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Sets up a ref that automatically focuses its current element after the route (pathname) changes.
 * Use this to ensure the primary heading receives focus when navigating between pages for accessibility.
 *
 * @typeParam T - The specific type of HTMLElement that will receive focus.
 * @returns A mutable ref object that should be assigned to the heading or focusable element.
 */
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
