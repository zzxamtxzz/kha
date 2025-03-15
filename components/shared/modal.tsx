"use client";

import { useRouter } from "next/navigation";
import type { FC, ReactNode } from "react";
import { Dialog, DialogContent, DialogOverlay } from "../ui/dialog";
import { cn } from "@/lib/utils";

interface ModalProps {
  children: ReactNode;
  className?: string;
}

export const Modal: FC<ModalProps> = ({ children, className }) => {
  const router = useRouter();

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <Dialog open onOpenChange={handleOnOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/70" />
      <DialogContent className={cn("p-0", className)}>{children}</DialogContent>
    </Dialog>
  );
};
