"use client";

import { Dialog } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditDevicePage from "../../../[id]/edit/page";

export default function EditDeviceModal({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Open the dialog when the component mounts
  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsOpen(false);
          router.back();
        }
      }}
    >
      <EditDevicePage params={params} />
    </Dialog>
  );
}
