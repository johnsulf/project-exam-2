import { useId, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUpdateProfile } from "./hooks";
import { getErrorMessage } from "@/lib/errors";
import { Spinner } from "@/components/ui/spinner";

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
      toast.error(getErrorMessage(e));
    }
  }

  return (
    <div
      className="inline-flex items-center gap-4 rounded-lg border p-4"
      role="group"
      aria-labelledby={`${id}-label`}
    >
      <div>
        <Label id={`${id}-label`} className="font-medium">
          Venue manager
        </Label>
        <p className="text-sm text-muted-foreground">
          Manage venues and bookings.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {isPending ? (
          <span
            id={`${id}-help`}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Spinner aria-hidden="true" />
          </span>
        ) : (
          <Switch
            id={id}
            checked={checked}
            onCheckedChange={(v) => onChange(!!v)}
            aria-describedby={`${id}-help`}
          />
        )}
      </div>
    </div>
  );
}
