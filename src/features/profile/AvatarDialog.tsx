import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUpdateProfile } from "./hooks";
import { getErrorMessage } from "@/lib/errors";
import { Spinner } from "@/components/ui/spinner";

const schema = z.object({
  url: z.string().url("Enter a valid image URL (https://...)"),
  alt: z.string().max(120).optional(),
});
type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  name: string; // current user name (id)
  currentUrl?: string;
  currentAlt?: string;
};

export function AvatarDialog({
  open,
  onOpenChange,
  name,
  currentUrl,
  currentAlt,
}: Props) {
  const [imgOk, setImgOk] = useState<boolean | null>(null);
  const { mutateAsync, isPending } = useUpdateProfile(name);

  const f = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { url: currentUrl ?? "", alt: currentAlt ?? "" },
    mode: "onBlur",
  });

  async function onSubmit(values: FormValues) {
    const p = mutateAsync({ avatar: { url: values.url, alt: values.alt } });
    toast.promise(p, {
      loading: "Updating avatar…",
      success: "Avatar updated",
      error: (e) => getErrorMessage(e),
    });
    onOpenChange(false);
  }

  const watchUrl = f.watch("url");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update avatar</DialogTitle>
          <DialogDescription>
            Paste a publicly accessible image URL. The API verifies the URL is
            reachable.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={f.handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label htmlFor="url">Image URL</Label>
            <Input id="url" placeholder="https://..." {...f.register("url")} />
            {f.formState.errors.url && (
              <p className="text-sm text-destructive">
                {f.formState.errors.url.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="alt">Alt text (optional)</Label>
            <Input
              id="alt"
              placeholder="Describe the image"
              {...f.register("alt")}
            />
          </div>

          {/* Live preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div
              className={cn(
                "h-24 w-24 overflow-hidden rounded-full border grid place-items-center bg-muted",
              )}
            >
              {watchUrl ? (
                <img
                  src={watchUrl}
                  className="h-full w-full object-cover"
                  onLoad={() => setImgOk(true)}
                  onError={() => setImgOk(false)}
                />
              ) : (
                <span className="text-xs text-muted-foreground">No URL</span>
              )}
            </div>
            {imgOk === false && (
              <p className="text-xs text-destructive">
                Image failed to load. Check that the URL is public.
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !f.formState.isValid}
              aria-busy={isPending}
            >
              {isPending && <Spinner className="mr-2" aria-hidden="true" />}
              {isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
