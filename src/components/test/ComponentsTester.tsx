import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { useState } from "react";

export default function ComponentsTester() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Tooltip + toast */}
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

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking created</DialogTitle>
            <DialogDescription>We emailed your confirmation.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setOpenDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sheet (right side) */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          <Button variant="default">Open filters</Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[360px] sm:w-[420px]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Refine your search.</SheetDescription>
          </SheetHeader>
          {/* ...controls here... */}
          <SheetFooter className="mt-6">
            <Button onClick={() => setOpenSheet(false)} className="w-full">
              Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
