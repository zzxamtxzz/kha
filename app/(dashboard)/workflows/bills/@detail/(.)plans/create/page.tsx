"use client";

import { Dialog } from "@/components/shared/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreatePlanForm from "../../../plans/create/client";

export default function CreateDeviceModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          router.back();
          setIsOpen(open);
        }
      }}
    >
      <CreatePlanForm
        onClose={() => setIsOpen(false)}
        onSuccess={() => setIsOpen(false)}
      />
    </Dialog>
  );
}
