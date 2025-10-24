import { useEffect, useMemo, useRef, useState } from "react";
import { isValidElement, Children } from "react";
import type { ReactNode } from "react";
import { useSonner } from "sonner";

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return `${node}`;
  if (Array.isArray(node)) {
    return node
      .map((child) => extractText(child))
      .filter(Boolean)
      .join(" ");
  }
  if (isValidElement(node)) {
    return extractText(node.type === "string");
  }
  return Children.toArray(node)
    .map((child) => extractText(child))
    .filter(Boolean)
    .join(" ");
}

type Announcement = {
  id: number | string;
  text: string;
  politeness: "polite" | "assertive";
  role: "status" | "alert";
};

export function ToastAnnouncer() {
  const { toasts } = useSonner();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const lastSpokenId = useRef<Announcement["id"] | null>(null);

  const latestToast = useMemo(() => {
    for (let i = toasts.length - 1; i >= 0; i -= 1) {
      const toast = toasts[i];
      if (!toast || toast.delete) continue;
      if (!toast.title && !toast.description) continue;
      return toast;
    }
    return null;
  }, [toasts]);

  useEffect(() => {
    if (!latestToast) return;
    if (lastSpokenId.current === latestToast.id) return;

    const titleNode =
      typeof latestToast.title === "function"
        ? latestToast.title()
        : latestToast.title;
    const descriptionNode =
      typeof latestToast.description === "function"
        ? latestToast.description()
        : latestToast.description;

    const message = [extractText(titleNode), extractText(descriptionNode)]
      .filter(Boolean)
      .join(". ")
      .trim();

    if (!message) return;

    const assertiveTypes = new Set(["error", "warning"]);
    const isAssertive = assertiveTypes.has(latestToast.type ?? "normal");

    const nextAnnouncement: Announcement = {
      id: latestToast.id,
      text: message,
      politeness: isAssertive ? "assertive" : "polite",
      role: isAssertive ? "alert" : "status",
    };

    lastSpokenId.current = latestToast.id;
    setAnnouncement(nextAnnouncement);
  }, [latestToast]);

  if (!announcement) return null;

  return (
    <div
      role={announcement.role}
      aria-live={announcement.politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement.text}
    </div>
  );
}
