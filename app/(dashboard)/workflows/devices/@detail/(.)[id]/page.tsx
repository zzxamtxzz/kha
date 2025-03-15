"use client";

import { Dialog } from "@/components/shared/dialog";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import DeviceDetailClient from "../../[id]/client";

export default function CreateDeviceModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const { id } = useParams();

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
      <DeviceDetailClient id={id as string} />
    </Dialog>
  );
}
