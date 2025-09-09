import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Tester() {
  return (
    <div className="flex items-center gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => toast.success("This is a toast from Sonner")}
              variant="secondary"
            >
              Show toast
            </Button>
          </TooltipTrigger>
          <TooltipContent>Click to trigger a toast</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
