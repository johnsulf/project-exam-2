import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1.5">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="ml-1 rounded p-0.5 hover:bg-muted"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

export function ActiveFilters() {
  const [params, setParams] = useSearchParams();

  const entries: Array<{ key: string; label: string; remove: () => void }> = [];

  const removeKey = (key: string | string[]) => () => {
    const p = new URLSearchParams(params);
    if (Array.isArray(key)) key.forEach((k) => p.delete(k));
    else p.delete(key);
    p.set("page", "1");
    setParams(p, { replace: true });
  };

  const q = params.get("q");
  if (q) entries.push({ key: "q", label: `“${q}”`, remove: removeKey("q") });

  const guests = params.get("guests");
  if (guests)
    entries.push({
      key: "guests",
      label: `Guests: ${guests}`,
      remove: removeKey("guests"),
    });

  const from = params.get("from");
  const to = params.get("to");
  if (from || to) {
    const f = from ? new Date(from).toLocaleDateString() : "…";
    const t = to ? new Date(to).toLocaleDateString() : "…";
    entries.push({
      key: "dates",
      label: `${f} – ${t}`,
      remove: removeKey(["from", "to"]),
    });
  }

  const flag = (name: string, label: string) => {
    if (params.get(name) === "1") {
      entries.push({ key: name, label, remove: removeKey(name) });
    }
  };
  flag("wifi", "WiFi");
  flag("parking", "Parking");
  flag("pets", "Pets");
  flag("breakfast", "Breakfast");

  const clearAll = () => {
    const keep = ["limit"];
    const p = new URLSearchParams();
    keep.forEach((k) => {
      const v = params.get(k);
      if (v) p.set(k, v);
    });
    p.set("page", "1");
    setParams(p, { replace: true });
  };

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      {entries.map((e) => (
        <Chip key={e.key} label={e.label} onRemove={e.remove} />
      ))}
      <Button variant="ghost" size="sm" onClick={clearAll}>
        Clear all
      </Button>
    </div>
  );
}
