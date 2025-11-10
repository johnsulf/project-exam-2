import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Announces route changes through an ARIA live region for screen reader users.
 * @returns A visually hidden element that conveys navigation updates.
 */
export function RouteAnnouncer() {
  const { pathname } = useLocation();
  const [message, setMessage] = useState("");
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setMessage(`Navigated to ${pathname}`);
  }, [pathname]);

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
