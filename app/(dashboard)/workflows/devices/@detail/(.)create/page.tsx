"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shared/dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CreateDeviceForm from "../../create/form";

export default function CreateDeviceModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  // Handle dialog close
  const handleClose = () => {
    router.back();
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create New Device
          </DialogTitle>
          <DialogDescription>
            Add a new device to your inventory
          </DialogDescription>
        </DialogHeader>

        <CreateDeviceForm />
      </DialogContent>
    </Dialog>
  );
}
