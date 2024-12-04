"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useClickOutside from "@/hooks/outside";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
type ModalProps = {
  children: React.ReactNode;
  className?: string;
};

export const Modal = ({ children, className }: ModalProps) => {
  const [, setOpen] = useState(true);
  const router = useRouter();
  const handleOnClose = () => router.back();
  const closeRef = useRef(null);
  useClickOutside(closeRef, handleOnClose);

  return (
    <Dialog open onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "w-full overflow-y-auto h-full m-0 p-0 border-0 center",
          className
        )}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};
