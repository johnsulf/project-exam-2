import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { listVenues } from "@/lib/endpoints";

export default function ApiSmokeTest() {
  return (
    <Button
      variant="outline"
      onClick={async () => {
        try {
          const res = await listVenues({ page: 1, limit: 1 });
          const first = res.data?.[0];
          toast.success(
            first ? `OK: ${first.name as string}` : "OK: no venues",
          );
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : String(e);
          toast.error(`API error: ${message}`);
          console.error(e);
        }
      }}
    >
      Ping API
    </Button>
  );
}
