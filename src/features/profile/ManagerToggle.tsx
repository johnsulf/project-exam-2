import { useId, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUpdateProfile } from "./hooks";

type Props = {
  name: string;
  venueManager: boolean;
};

export function ManagerToggle({ name, venueManager }: Props) {
  const id = useId();
  const [checked, setChecked] = useState(venueManager);
  const { mutateAsync, isPending } = useUpdateProfile(name);

  async function onChange(next: boolean) {
    try {
      setChecked(next);
      await mutateAsync({ venueManager: next });
      toast.success(
        next ? "You’re now a venue manager" : "Manager role removed",
      );
    } catch (e) {
      setChecked(!next);
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  }

  return (
    <div
      className="inline-flex items-center gap-3 rounded-xl border p-3"
      role="group"
      aria-labelledby={`${id}-label`}
    >
      <div>
        <Label id={`${id}-label`} className="font-medium">
          Venue manager
        </Label>
        <p className="text-sm text-muted-foreground">
          {checked
            ? "Manage venues and bookings."
            : "Enable to create and manage venues."}
        </p>
      </div>

      <div className="ml-4 flex items-center gap-2">
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={(v) => onChange(!!v)}
          aria-describedby={`${id}-help`}
          disabled={isPending}
        />
        {isPending && (
          <span id={`${id}-help`} className="text-xs text-muted-foreground">
            Saving…
          </span>
        )}
      </div>
    </div>
  );
}
